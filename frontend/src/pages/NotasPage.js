import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Plus, Trash2, Eye, Calculator } from 'lucide-react';
import { toast } from 'sonner';

const NotasPage = () => {
  const [notas, setNotas] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedNota, setSelectedNota] = useState(null);
  const [formData, setFormData] = useState({
    empresa_id: '',
    numero_nf: '',
    itens: [{ produto_id: '', quantidade: '1' }]
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [notasRes, empresasRes, produtosRes] = await Promise.all([
        axios.get('/notas'),
        axios.get('/empresas'),
        axios.get('/produtos')
      ]);
      setNotas(notasRes.data);
      setEmpresas(empresasRes.data);
      setProdutos(produtosRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      empresa_id: formData.empresa_id,
      numero_nf: formData.numero_nf,
      itens: formData.itens.map(item => ({
        produto_id: item.produto_id,
        quantidade: parseFloat(item.quantidade)
      }))
    };
    
    try {
      await axios.post('/notas', payload);
      toast.success('Nota fiscal emitida com sucesso!');
      fetchData();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao emitir nota fiscal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta nota fiscal?')) return;
    
    try {
      await axios.delete(`/notas/${id}`);
      toast.success('Nota fiscal excluída com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir nota fiscal');
    }
  };

  const resetForm = () => {
    setFormData({
      empresa_id: '',
      numero_nf: '',
      itens: [{ produto_id: '', quantidade: '1' }]
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      itens: [...formData.itens, { produto_id: '', quantidade: '1' }]
    });
  };

  const removeItem = (index) => {
    const newItens = formData.itens.filter((_, i) => i !== index);
    setFormData({ ...formData, itens: newItens });
  };

  const updateItem = (index, field, value) => {
    const newItens = [...formData.itens];
    newItens[index][field] = value;
    setFormData({ ...formData, itens: newItens });
  };

  const getEmpresaNome = (empresaId) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa ? empresa.nome : 'N/A';
  };

  const getProdutoNome = (produtoId) => {
    const produto = produtos.find(p => p.id === produtoId);
    return produto ? produto.nome : 'N/A';
  };

  const viewDetails = (nota) => {
    setSelectedNota(nota);
    setDetailDialogOpen(true);
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

  return (
    <Layout>
      <div className="space-y-6" data-testid="notas-page">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Notas Fiscais</h1>
            <p className="text-slate-600 mt-1">Emita e gerencie notas fiscais</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button data-testid="add-nota-btn">
                <Plus className="h-4 w-4 mr-2" />
                Emitir Nota Fiscal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Emitir Nota Fiscal</DialogTitle>
                <DialogDescription>
                  Preencha os dados da nota fiscal. Os impostos serão calculados automaticamente.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="nota-form">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empresa">Empresa</Label>
                    <Select
                      value={formData.empresa_id}
                      onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
                      required
                    >
                      <SelectTrigger data-testid="nota-empresa-select">
                        <SelectValue placeholder="Selecione a empresa" />
                      </SelectTrigger>
                      <SelectContent>
                        {empresas.map(empresa => (
                          <SelectItem key={empresa.id} value={empresa.id}>{empresa.nome}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="numero_nf">Número da NF</Label>
                    <Input
                      id="numero_nf"
                      data-testid="nota-numero-input"
                      value={formData.numero_nf}
                      onChange={(e) => setFormData({ ...formData, numero_nf: e.target.value })}
                      placeholder="Ex: 001/2025"
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold">Itens da Nota</h3>
                    <Button type="button" variant="outline" size="sm" onClick={addItem} data-testid="add-item-btn">
                      <Plus className="h-4 w-4 mr-2" />
                      Adicionar Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {formData.itens.map((item, index) => (
                      <div key={index} className="flex gap-3 p-3 bg-slate-50 rounded-lg" data-testid="nota-item">
                        <div className="flex-1">
                          <Label>Produto</Label>
                          <Select
                            value={item.produto_id}
                            onValueChange={(value) => updateItem(index, 'produto_id', value)}
                            required
                          >
                            <SelectTrigger data-testid="item-produto-select">
                              <SelectValue placeholder="Selecione o produto" />
                            </SelectTrigger>
                            <SelectContent>
                              {produtos.map(produto => (
                                <SelectItem key={produto.id} value={produto.id}>
                                  {produto.nome} - R$ {produto.valor_unitario.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="w-32">
                          <Label>Quantidade</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0.01"
                            data-testid="item-quantidade-input"
                            value={item.quantidade}
                            onChange={(e) => updateItem(index, 'quantidade', e.target.value)}
                            required
                          />
                        </div>
                        
                        {formData.itens.length > 1 && (
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              data-testid="remove-item-btn"
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-blue-800">
                    Os impostos (ICMS, PIS, COFINS, IPI) serão calculados automaticamente com base nas alíquotas dos produtos.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" data-testid="nota-submit-btn">
                    Emitir Nota Fiscal
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {notas.length === 0 ? (
          <Card className="p-12 text-center" data-testid="empty-notas-state">
            <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhuma nota fiscal emitida</h3>
            <p className="text-slate-500 mb-6">Comece emitindo sua primeira nota fiscal</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Emitir Nota Fiscal
            </Button>
          </Card>
        ) : (
          <div className="space-y-4" data-testid="notas-list">
            {notas.map((nota) => (
              <Card key={nota.id} className="hover:shadow-lg transition" data-testid="nota-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <FileText className="h-8 w-8 text-purple-600" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-slate-800" data-testid="nota-numero">
                            NF {nota.numero_nf}
                          </h3>
                          <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            Emitida
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-3">{nota.empresa_nome}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                          <div>
                            <p className="text-slate-500 text-xs">Data Emissão</p>
                            <p className="font-semibold">{new Date(nota.data_emissao).toLocaleDateString('pt-BR')}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">Valor Total</p>
                            <p className="font-semibold text-green-600">
                              R$ {nota.total_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">ICMS</p>
                            <p className="font-semibold">R$ {nota.total_icms.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">PIS</p>
                            <p className="font-semibold">R$ {nota.total_pis.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-slate-500 text-xs">COFINS</p>
                            <p className="font-semibold">R$ {nota.total_cofins.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => viewDetails(nota)}
                        data-testid="view-nota-btn"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(nota.id)}
                        data-testid="delete-nota-btn"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Nota Fiscal</DialogTitle>
            <DialogDescription>NF {selectedNota?.numero_nf}</DialogDescription>
          </DialogHeader>
          
          {selectedNota && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-sm text-slate-500">Empresa</p>
                  <p className="font-semibold">{selectedNota.empresa_nome}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500">Data de Emissão</p>
                  <p className="font-semibold">{new Date(selectedNota.data_emissao).toLocaleDateString('pt-BR')}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Itens da Nota</h3>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600">Produto</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Qtd</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Valor Unit.</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedNota.itens.map((item, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-3 text-sm">{item.produto_nome}</td>
                          <td className="px-4 py-3 text-sm text-right">{item.quantidade}</td>
                          <td className="px-4 py-3 text-sm text-right">R$ {item.valor_unitario.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm text-right font-semibold">R$ {item.total_item.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Totais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-slate-600">Valor Total:</span>
                      <span className="font-bold text-green-600">
                        R$ {selectedNota.total_valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Impostos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">ICMS:</span>
                      <span className="font-semibold">R$ {selectedNota.total_icms.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">PIS:</span>
                      <span className="font-semibold">R$ {selectedNota.total_pis.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">COFINS:</span>
                      <span className="font-semibold">R$ {selectedNota.total_cofins.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">IPI:</span>
                      <span className="font-semibold">R$ {selectedNota.total_ipi.toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default NotasPage;