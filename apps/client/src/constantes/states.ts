export const states = {
  ice: {
    new: `Até agora nenhum par foi encontrado, tentarei uma nova oferta`,
    checking: `Recebi um candidato remoto e estou verificando pares para ele, mas ainda não encontrei uma conexão...
    Ou as verificações de consentimento (RFC7675) falharam em todos os pares de candidatos anteriormente bem-sucedidos.
    Vou verificar e continuar reunindo informações`,
    disconnected: `Perdemos o transporte para estabelecer conexão, parece que a rede está instável`,
    closed: `Perdemos o transporte para estabelecer conexão, parece que a rede está instável`,
    failed: `Recebi a informação de que não há mais candidatos remotos, a verificação de todos os pares de candidatos
    e todos os pares falharam nas verificações de conectividade ou perderam o consentimento e nenhum candidato local foi coletado.
    Vou tentar uma nova oferta reiniciando o transporte para uma nova tentativa de busca por pares...`,
    completed: `Não há mais candidatos de transporte, a verificação foi concluída e encontramos um par`,
    connected: `Encontramos um transporte utilizável, estamos conectados mas ainda estarei em busca de outros...`,
  },
}
