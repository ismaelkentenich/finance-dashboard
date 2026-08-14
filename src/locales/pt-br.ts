import type { TranslationSchema } from "./types";

export const pt: TranslationSchema = {
  common: {
    loading: "Carregando dados financeiros...",
    noData: "Nenhum dado disponível.",
  },
  header: {
    title: "Visão Geral Financeira",
    periodBadge: "Agosto 2026",
  },
  sidebar: {
    brandName: "FinFlow",
    navigation: {
      overview: "Visão Geral",
      transactions: "Transações",
    },
    userRole: "Conta Premium",
  },
  filters: {
    periodLabel: "Período",
    periods: {
      "current-month": "Mês Atual",
      "previous-month": "Mês Anterior",
      "last-3-months": "Últimos 3 Meses",
      custom: "Personalizado",
    },
    typeLabel: "Tipo",
    types: {
      all: "Todos os Tipos",
      income: "Receitas",
      expense: "Despesas",
    },
    categoryLabel: "Categoria",
    allCategories: "Todas as Categorias",
    clearFilters: "Limpar Filtros",
  },
  summary: {
    balance: "Saldo Atual",
    income: "Receitas Totais",
    expenses: "Despesas Totais",
    savingsRate: "Taxa de Poupança",
    vsPreviousMonth: "vs mês anterior",
    ofTotalIncome: "Do total de receitas no mês",
  },
  categories: {
    title: "Despesas por Categoria",
    empty: "Nenhum dado de despesa para este período.",
    labels: {
      housing: "Moradia",
      food: "Alimentação & Mercado",
      transportation: "Transporte",
      utilities: "Contas & Utilidades",
      entertainment: "Lazer & Entretenimento",
      healthcare: "Saúde",
      education: "Educação",
      shopping: "Compras",
      services: "Serviços",
      salary: "Salário",
      freelance: "Freelance",
      investment: "Investimentos",
      other: "Outros",
    },
  },
  transactions: {
    title: "Transações Recentes",
    empty: "Nenhuma transação encontrada para o período selecionado.",
    table: {
      description: "Descrição",
      category: "Categoria",
      date: "Data",
      amount: "Valor",
    },
  },
  transactionModal: {
    triggerButton: "Nova Transação",
    title: "Adicionar Nova Transação",
    description: "Preencha os dados abaixo para registrar uma movimentação financeira.",
    fields: {
      descriptionLabel: "Descrição",
      descriptionPlaceholder: "Ex: Compras no Supermercado",
      amountLabel: "Valor (R$)",
      amountPlaceholder: "0.00",
      typeLabel: "Tipo de Movimentação",
      categoryLabel: "Categoria",
      dateLabel: "Data",
    },
    buttons: {
      cancel: "Cancelar",
      submit: "Salvar Transação",
      submitting: "Salvando...",
    },
    successMessage: "Transação criada com sucesso!",
    errorMessage: "Falha ao salvar a transação. Tente novamente.",
  },
};
