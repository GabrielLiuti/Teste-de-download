import React, { useState, useContext } from 'react';
import { AuthContext } from '@/App';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';
import { toast } from 'sonner';
import { FileText, TrendingUp, Calculator } from 'lucide-react';

const LoginPage = () => {
  const { login } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginData, setLoginData] = useState({ email: '', senha: '' });
  const [registerData, setRegisterData] = useState({ nome: '', email: '', senha: '', senhaConfirm: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await axios.post('/auth/login', loginData);
      toast.success('Login realizado com sucesso!');
      login(response.data.token, response.data.usuario);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (registerData.senha !== registerData.senhaConfirm) {
      toast.error('As senhas não coincidem');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('/auth/register', {
        nome: registerData.nome,
        email: registerData.email,
        senha: registerData.senha
      });
      toast.success('Cadastro realizado com sucesso!');
      login(response.data.token, response.data.usuario);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Erro ao fazer cadastro');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8" data-testid="branding-section">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FiscalManager Total
            </h1>
            <p className="text-xl text-slate-600">
              Sistema completo de gestão fiscal corporativa
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur rounded-xl">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Emissão de Notas</h3>
                <p className="text-sm text-slate-600">Emita notas fiscais com cálculo automático de impostos</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur rounded-xl">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <Calculator className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Cálculo de Impostos</h3>
                <p className="text-sm text-slate-600">ICMS, PIS, COFINS e IPI calculados automaticamente</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4 p-4 bg-white/60 backdrop-blur rounded-xl">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-800">Relatórios e Dashboards</h3>
                <p className="text-sm text-slate-600">Visualize seus dados fiscais em tempo real</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Forms */}
        <div data-testid="auth-forms">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login" data-testid="login-tab">Login</TabsTrigger>
              <TabsTrigger value="register" data-testid="register-tab">Cadastro</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card>
                <CardHeader>
                  <CardTitle>Entrar na sua conta</CardTitle>
                  <CardDescription>Digite suas credenciais para acessar o sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <Input
                        id="login-email"
                        data-testid="login-email-input"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-senha">Senha</Label>
                      <Input
                        id="login-senha"
                        data-testid="login-password-input"
                        type="password"
                        placeholder="••••••••"
                        value={loginData.senha}
                        onChange={(e) => setLoginData({ ...loginData, senha: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading} data-testid="login-submit-btn">
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card>
                <CardHeader>
                  <CardTitle>Criar nova conta</CardTitle>
                  <CardDescription>Preencha os dados para começar a usar o sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-nome">Nome Completo</Label>
                      <Input
                        id="register-nome"
                        data-testid="register-name-input"
                        type="text"
                        placeholder="Seu nome"
                        value={registerData.nome}
                        onChange={(e) => setRegisterData({ ...registerData, nome: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        data-testid="register-email-input"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-senha">Senha</Label>
                      <Input
                        id="register-senha"
                        data-testid="register-password-input"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.senha}
                        onChange={(e) => setRegisterData({ ...registerData, senha: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-senha-confirm">Confirmar Senha</Label>
                      <Input
                        id="register-senha-confirm"
                        data-testid="register-password-confirm-input"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.senhaConfirm}
                        onChange={(e) => setRegisterData({ ...registerData, senhaConfirm: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading} data-testid="register-submit-btn">
                      {isLoading ? 'Cadastrando...' : 'Criar Conta'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;