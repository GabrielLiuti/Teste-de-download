import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Package, FileText, TrendingUp, DollarSign, Calculator } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get('/dashboard');
      setStats(response.data);
    } catch (error) {
      toast.error('Erro ao carregar dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

  const impostoData = [
    { name: 'ICMS', value: stats?.total_impostos?.icms || 0, color: COLORS[0] },
    { name: 'PIS', value: stats?.total_impostos?.pis || 0, color: COLORS[1] },
    { name: 'COFINS', value: stats?.total_impostos?.cofins || 0, color: COLORS[2] },
    { name: 'IPI', value: stats?.total_impostos?.ipi || 0, color: COLORS[3] }
  ];

  const barData = impostoData.map(item => ({
    name: item.name,
    Valor: item.value
  }));

  return (
    <Layout>
      <div className="space-y-6" data-testid="dashboard-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard Fiscal</h1>
          <p className="text-slate-600 mt-1">Visão geral do seu sistema fiscal</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg" data-testid="card-empresas">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total de Empresas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold" data-testid="total-empresas">{stats?.total_empresas || 0}</p>
                  <p className="text-xs opacity-80 mt-1">Empresas cadastradas</p>
                </div>
                <Building2 className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white border-0 shadow-lg" data-testid="card-produtos">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Total de Produtos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold" data-testid="total-produtos">{stats?.total_produtos || 0}</p>
                  <p className="text-xs opacity-80 mt-1">Produtos cadastrados</p>
                </div>
                <Package className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0 shadow-lg" data-testid="card-notas">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Notas Fiscais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold" data-testid="total-notas">{stats?.total_notas || 0}</p>
                  <p className="text-xs opacity-80 mt-1">Notas emitidas</p>
                </div>
                <FileText className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg" data-testid="card-valor-total">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium opacity-90">Valor Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold" data-testid="total-valor-notas">
                    R$ {(stats?.total_valor_notas || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs opacity-80 mt-1">Em notas fiscais</p>
                </div>
                <DollarSign className="h-12 w-12 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <Card className="shadow-lg" data-testid="chart-bar">
            <CardHeader>
              <CardTitle>Impostos por Tipo</CardTitle>
              <CardDescription>Distribuição dos impostos cobrados</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  />
                  <Legend />
                  <Bar dataKey="Valor" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Pie Chart */}
          <Card className="shadow-lg" data-testid="chart-pie">
            <CardHeader>
              <CardTitle>Proporção de Impostos</CardTitle>
              <CardDescription>Percentual de cada imposto no total</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={impostoData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {impostoData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Notes */}
        <Card className="shadow-lg" data-testid="recent-notes-card">
          <CardHeader>
            <CardTitle>Notas Fiscais Recentes</CardTitle>
            <CardDescription>Últimas notas emitidas</CardDescription>
          </CardHeader>
          <CardContent>
            {stats?.notas_recentes && stats.notas_recentes.length > 0 ? (
              <div className="space-y-4">
                {stats.notas_recentes.map((nota, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">NF {nota.numero_nf}</p>
                        <p className="text-sm text-slate-600">{nota.empresa_nome}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-800">
                        R$ {(nota.total_valor || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-xs text-slate-500">
                        {new Date(nota.data_emissao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 py-8">Nenhuma nota fiscal emitida ainda</p>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;