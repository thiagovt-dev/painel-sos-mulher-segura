export function tIncidentStatus(s: string): string {
  switch (s) {
    case 'OPEN': return 'Aberto';
    case 'IN_DISPATCH': return 'Em Despacho';
    case 'RESOLVED': return 'Resolvido';
    case 'CANCELED': return 'Cancelado';
    default: return s;
  }
}

export function tDispatchStatus(s: string): string {
  switch (s) {
    case 'PENDING': return 'Pendente';
    case 'NOTIFIED': return 'Notificado';
    case 'ACCEPTED': return 'Aceito';
    case 'REJECTED': return 'Recusado';
    case 'RESOLVED': return 'Resolvido';
    case 'CANCELED': return 'Cancelado';
    default: return s;
  }
}

export function tError(msg: string): string {
  const m = msg?.toLowerCase?.() || '';
  if (m.includes('status must be one of')) {
    return 'Status inválido. Valores aceitos: OPEN, IN_DISPATCH, RESOLVED, CANCELED';
  }
  if (m.includes('unauthorized') || m.includes('invalid token')) {
    return 'Sessão expirada ou inválida. Faça login novamente.';
  }
  if (m.includes('not found')) {
    return 'Registro não encontrado.';
  }
  if (m.includes('forbidden')) {
    return 'Acesso negado. Permissões insuficientes.';
  }
  if (m.includes('bad request') || m.includes('validation')) {
    return 'Dados inválidos. Verifique os campos e tente novamente.';
  }
  return msg || 'Ocorreu um erro. Tente novamente.';
}

