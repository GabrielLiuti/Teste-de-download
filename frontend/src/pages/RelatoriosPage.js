import React, { useState } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Table } from 'lucide-react';
import { toast } from 'sonner';

const RelatoriosPage = () => {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingExcel, setLoadingExcel] = useState(false);

  const downloadPDF = async () => {
    setLoadingPdf(true);
    try {
      const response = await axios.get('/relatorios/pdf', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_fiscal.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Relatório PDF gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório PDF');
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadExcel = async () => {
    setLoadingExcel(true);
    try {
      const response = await axios.get('/relatorios/excel', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'relatorio_fiscal.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      toast.success('Relatório Excel gerado com sucesso!');
    } catch (error) {
      toast.error('Erro ao gerar relatório Excel');
    } finally {
      setLoadingExcel(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6" data-testid="relatorios-page">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Relatórios</h1>
          <p className="text-slate-600 mt-1">Exporte seus dados fiscais em diferentes formatos</p>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* PDF Report */}
          <Card className="hover:shadow-lg transition" data-testid="pdf-report-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 rounded-lg">
                  <FileText className="h-8 w-8 text-red-600" />
                </div>
                <div>
                  <CardTitle>Relatório PDF</CardTitle>
                  <CardDescription>Documento formatado para impressão</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Gere um relatório completo em PDF com todas as notas fiscais, valores totais e impostos calculados.
                  Ideal para apresentações e arquivo físico.
                </p>
                
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    Resumo executivo de impostos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    Total de notas fiscais
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-blue-600 rounded-full"></div>
                    Valores consolidados
                  </li>
                </ul>
                
                <Button 
                  onClick={downloadPDF} 
                  disabled={loadingPdf}
                  className="w-full"
                  data-testid="download-pdf-btn"
                >
                  {loadingPdf ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Relatório PDF
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Excel Report */}
          <Card className="hover:shadow-lg transition" data-testid="excel-report-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Table className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <CardTitle>Relatório Excel</CardTitle>
                  <CardDescription>Planilha para análise de dados</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-slate-600">
                  Exporte seus dados em formato Excel (XLSX) para análise avançada, gráficos personalizados e integração com outras ferramentas.
                </p>
                
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                    Dados detalhados por nota
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                    Impostos discriminados
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 bg-green-600 rounded-full"></div>
                    Formato editável
                  </li>
                </ul>
                
                <Button 
                  onClick={downloadExcel} 
                  disabled={loadingExcel}
                  className="w-full"
                  data-testid="download-excel-btn"
                >
                  {loadingExcel ? (
                    'Gerando...'
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Baixar Relatório Excel
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Card */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-600 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800 mb-2">Sobre os Relatórios</h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  Os relatórios são gerados em tempo real com base nos dados mais atuais do sistema.
                  Todos os cálculos de impostos (ICMS, PIS, COFINS e IPI) são realizados automaticamente
                  de acordo com as alíquotas configuradas em cada produto e o regime tributário da empresa.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default RelatoriosPage;