import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Package, Plus, Edit, Trash2, DollarSign, Percent } from 'lucide-react';
import { toast } from 'sonner';

const ProdutosPage = () => {
  const [produtos, setProdutos] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduto, setEditingProduto] = useState(null);
  const [formData, setFormData] = useState({
    empresa_id: '',
    nome: '',
    codigo: '',
    categoria: '',
    valor_unitario: '',
    aliquota_icms: '18',
    aliquota_pis: '1.65',
    aliquota_cofins: '7.6',
    aliquota_ipi: '0'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [produtosRes, empresasRes] = await Promise.all([
        axios.get('/produtos'),
        axios.get('/empresas')
      ]);
      setProdutos(produtosRes.data);
      setEmpresas(empresasRes.data);
    } catch (error) {
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      valor_unitario: parseFloat(formData.valor_unitario),
      aliquota_icms: parseFloat(formData.aliquota_icms),
      aliquota_pis: parseFloat(formData.aliquota_pis),
      aliquota_cofins: parseFloat(formData.aliquota_cofins),
      aliquota_ipi: parseFloat(formData.aliquota_ipi)
    };
    
    try {
      if (editingProduto) {
        await axios.put(`/produtos/${editingProduto.id}`, payload);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await axios.post('/produtos', payload);
        toast.success('Produto cadastrado com sucesso!');
      }
      
      fetchData();
      setDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao salvar produto');
    }
  };

  const handleEdit = (produto) => {
    setEditingProduto(produto);
    setFormData({
      empresa_id: produto.empresa_id,
      nome: produto.nome,
      codigo: produto.codigo,
      categoria: produto.categoria,
      valor_unitario: produto.valor_unitario.toString(),
      aliquota_icms: produto.aliquota_icms.toString(),
      aliquota_pis: produto.aliquota_pis.toString(),
      aliquota_cofins: produto.aliquota_cofins.toString(),
      aliquota_ipi: produto.aliquota_ipi.toString()
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
    
    try {
      await axios.delete(`/produtos/${id}`);
      toast.success('Produto excluído com sucesso!');
      fetchData();
    } catch (error) {
      toast.error('Erro ao excluir produto');
    }
  };

  const resetForm = () => {
    setFormData({
      empresa_id: '',
      nome: '',
      codigo: '',
      categoria: '',
      valor_unitario: '',
      aliquota_icms: '18',
      aliquota_pis: '1.65',
      aliquota_cofins: '7.6',
      aliquota_ipi: '0'
    });
    setEditingProduto(null);
  };

  const getEmpresaNome = (empresaId) => {
    const empresa = empresas.find(e => e.id === empresaId);
    return empresa ? empresa.nome : 'N/A';
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
      <div className="space-y-6" data-testid="produtos-page">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Produtos</h1>
            <p className="text-slate-600 mt-1">Gerencie o catálogo de produtos</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button data-testid="add-produto-btn">
                <Plus className="h-4 w-4 mr-2" />
                Novo Produto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingProduto ? 'Editar' : 'Novo'} Produto</DialogTitle>
                <DialogDescription>
                  Preencha os dados do produto e alíquotas de impostos
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4" data-testid="produto-form">
                <div>
                  <Label htmlFor="empresa">Empresa</Label>
                  <Select
                    value={formData.empresa_id}
                    onValueChange={(value) => setFormData({ ...formData, empresa_id: value })}
                    required
                  >
                    <SelectTrigger data-testid="produto-empresa-select">
                      <SelectValue placeholder="Selecione a empresa" />
                    </SelectTrigger>
                    <SelectContent>
                      {empresas.map(empresa => (
                        <SelectItem key={empresa.id} value={empresa.id}>{empresa.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nome">Nome do Produto</Label>
                    <Input
                      id="nome"
                      data-testid="produto-nome-input"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      data-testid="produto-codigo-input"
                      value={formData.codigo}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="categoria">Categoria</Label>
                    <Input
                      id="categoria"
                      data-testid="produto-categoria-input"
                      value={formData.categoria}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="valor">Valor Unitário (R$)</Label>
                    <Input
                      id="valor"
                      data-testid="produto-valor-input"
                      type="number"
                      step="0.01"
                      value={formData.valor_unitario}
                      onChange={(e) => setFormData({ ...formData, valor_unitario: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3">Alíquotas de Impostos (%)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icms">ICMS (%)</Label>
                      <Input
                        id="icms"
                        data-testid="produto-icms-input"
                        type="number"
                        step="0.01"
                        value={formData.aliquota_icms}
                        onChange={(e) => setFormData({ ...formData, aliquota_icms: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="pis">PIS (%)</Label>
                      <Input
                        id="pis"
                        data-testid="produto-pis-input"
                        type="number"
                        step="0.01"
                        value={formData.aliquota_pis}
                        onChange={(e) => setFormData({ ...formData, aliquota_pis: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="cofins">COFINS (%)</Label>
                      <Input
                        id="cofins"
                        data-testid="produto-cofins-input"
                        type="number"
                        step="0.01"
                        value={formData.aliquota_cofins}
                        onChange={(e) => setFormData({ ...formData, aliquota_cofins: e.target.value })}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="ipi">IPI (%)</Label>
                      <Input
                        id="ipi"
                        data-testid="produto-ipi-input"
                        type="number"
                        step="0.01"
                        value={formData.aliquota_ipi}
                        onChange={(e) => setFormData({ ...formData, aliquota_ipi: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" data-testid="produto-submit-btn">
                    {editingProduto ? 'Atualizar' : 'Cadastrar'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {produtos.length === 0 ? (
          <Card className="p-12 text-center" data-testid="empty-produtos-state">
            <Package className="h-16 w-16 mx-auto text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">Nenhum produto cadastrado</h3>
            <p className="text-slate-500 mb-6">Comece cadastrando seu primeiro produto</p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Produto
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="produtos-list">
            {produtos.map((produto) => (
              <Card key={produto.id} className="hover:shadow-lg transition" data-testid="produto-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Package className="h-6 w-6 text-indigo-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base" data-testid="produto-nome">{produto.nome}</CardTitle>
                        <p className="text-sm text-slate-500 mt-1">{produto.codigo}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(produto)}
                        data-testid="edit-produto-btn"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(produto.id)}
                        data-testid="delete-produto-btn"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="text-sm text-slate-600">
                      <p className="font-medium">{getEmpresaNome(produto.empresa_id)}</p>
                      <p className="text-xs mt-1">{produto.categoria}</p>
                    </div>
                    
                    <div className="flex items-center gap-2 text-lg font-bold text-slate-800">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      R$ {produto.valor_unitario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                    
                    <div className="pt-3 border-t">
                      <p className="text-xs font-semibold text-slate-600 mb-2">Alíquotas:</p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-blue-500" />
                          <span>ICMS: {produto.aliquota_icms}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-purple-500" />
                          <span>PIS: {produto.aliquota_pis}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-pink-500" />
                          <span>COFINS: {produto.aliquota_cofins}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Percent className="h-3 w-3 text-orange-500" />
                          <span>IPI: {produto.aliquota_ipi}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProdutosPage;