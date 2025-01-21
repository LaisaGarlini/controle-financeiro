import { type NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { parseStringPromise } from 'xml2js'
import { toast } from 'sonner'

const prisma = new PrismaClient()

interface Municipio {
    id: string
    nome: string
    estado: {
        sigla: string
    }
}

interface Pessoa {
    nome: string
    fantasia?: string
    tipo: string
    cpf_cnpj: string
    rg_ie?: string
}

async function processXMLContent(xmlContent: string, empresaId: number) {
    try {
        const parsedXML = await parseStringPromise(xmlContent)
        const cte = parsedXML.cteProc.CTe[0].infCte[0]

        const chave = cte.$.Id.replace('CTe', '')
        const dataEmissao = new Date(cte.ide[0].dhEmi[0])
        const valor = Number.parseFloat(cte.vPrest[0].vTPrest[0])

        const municipioInicio: Municipio = {
            id: cte.ide[0].cMunIni[0],
            nome: cte.ide[0].xMunIni[0],
            estado: { sigla: cte.ide[0].UFIni[0] },
        }

        const municipioFim: Municipio = {
            id: cte.ide[0].cMunFim[0],
            nome: cte.ide[0].xMunFim[0],
            estado: { sigla: cte.ide[0].UFFim[0] },
        }

        const emitente: Pessoa = {
            nome: cte.emit[0].xNome[0],
            fantasia: cte.emit[0].xFant ? cte.emit[0].xFant[0] : undefined,
            tipo: 'J',
            cpf_cnpj: cte.emit[0].CNPJ[0],
            rg_ie: cte.emit[0].IE[0],
        }

        const remetente: Pessoa = {
            nome: cte.rem[0].xNome[0],
            fantasia: cte.rem[0].xFant ? cte.rem[0].xFant[0] : undefined,
            tipo: cte.rem[0].CNPJ ? 'J' : 'F',
            cpf_cnpj: cte.rem[0].CNPJ ? cte.rem[0].CNPJ[0] : cte.rem[0].CPF[0],
            rg_ie: cte.rem[0].IE ? cte.rem[0].IE[0] : undefined,
        }

        const destinatario: Pessoa = {
            nome: cte.dest[0].xNome[0],
            tipo: cte.dest[0].CNPJ ? 'J' : 'F',
            cpf_cnpj: cte.dest[0].CNPJ ? cte.dest[0].CNPJ[0] : cte.dest[0].CPF[0],
            rg_ie: cte.dest[0].IE ? cte.dest[0].IE[0] : undefined,
        }

        const [municipioInicioRecord, municipioFimRecord] = await Promise.all([
            prisma.municipio.upsert({
                where: { id: Number(municipioInicio.id) },
                update: { nome: municipioInicio.nome },
                create: {
                    id: Number(municipioInicio.id),
                    nome: municipioInicio.nome,
                    estadoId: await getEstadoId(municipioInicio.estado.sigla, empresaId),
                    empresa_id: empresaId,
                },
            }),

            prisma.municipio.upsert({
                where: { id: Number(municipioFim.id) },
                update: { nome: municipioFim.nome },
                create: {
                    id: Number(municipioFim.id),
                    nome: municipioFim.nome,
                    estadoId: await getEstadoId(municipioFim.estado.sigla, empresaId),
                    empresa_id: empresaId,
                },
            }),
        ])

        const [emitenteRecord, remetenteRecord, destinatarioRecord] = await Promise.all([
            upsertPessoa(emitente, empresaId),
            upsertPessoa(remetente, empresaId),
            upsertPessoa(destinatario, empresaId),
        ])

        const cteRecord = await prisma.cTE.create({
            data: {
                chave,
                data_emissao: dataEmissao,
                valor,
                municipio_inicio: { connect: { id: municipioInicioRecord.id } },
                municipio_fim: { connect: { id: municipioFimRecord.id } },
                emitente: { connect: { id: emitenteRecord.id } },
                remetente: { connect: { id: remetenteRecord.id } },
                destinatario: { connect: { id: destinatarioRecord.id } },
                empresa: { connect: { id: empresaId } },
            },
        })

        return { success: true, chave: cteRecord.chave }
    } catch (error) {
        toast.error('Erro ao processar arquivos XML')
        throw error
    }
}

async function getEstadoId(sigla: string, empresaId: number): Promise<number> {
    const estado = await prisma.estado.findFirst({
        where: { sigla, empresa_id: empresaId },
    })
    if (!estado) {
        throw new Error(`Estado with sigla ${sigla} not found for empresa ${empresaId}`)
    }
    return estado.id
}

function removerMascara(cpf_cnpj: string): string {
    return cpf_cnpj.replace(/[^\d]+/g, '')
}

async function upsertPessoa(pessoa: Pessoa, empresaId: number) {
    const cpf_cnpjSemMascara = removerMascara(pessoa.cpf_cnpj)

    return prisma.pessoa.upsert({
        where: { cpf_cnpj: cpf_cnpjSemMascara },
        update: {
            nome: pessoa.nome,
            fantasia: pessoa.fantasia,
            rg_ie: pessoa.rg_ie,
            tipo_granjeiro: true,
        },
        create: {
            ...pessoa,
            cpf_cnpj: cpf_cnpjSemMascara,
            empresa: { connect: { id: empresaId } },
            tipo_granjeiro: true,
        },
    })
}

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const files = formData.getAll('files') as File[]
        const empresaId = Number(formData.get('empresaId'))

        if (!empresaId) {
            return NextResponse.json({ success: false, message: 'empresaId is required' }, { status: 400 })
        }

        const results = []
        for (const file of files) {
            const xmlContent = await file.text()
            const result = await processXMLContent(xmlContent, empresaId)
            results.push(result)
        }

        return NextResponse.json({
            success: true,
            message: 'XML files processed successfully',
            results,
        })
    } catch (error) {
        toast.error('Erro ao processar arquivos XML')
        return NextResponse.json({ success: false, message: 'Error processing XML files' }, { status: 500 })
    }
}
