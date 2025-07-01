import React, { useState } from 'react';
import { ArrowLeft, Download, Filter, Search } from 'lucide-react';

// UI Components
const Card = ({ children, className = '', onClick }) => (
  <div
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    onClick={onClick}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`flex items-center p-6 pt-0 ${className}`}>{children}</div>
);

const Button = ({
  children,
  className = '',
  variant = 'default',
  size = 'default',
  onClick,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'hover:bg-accent hover:text-accent-foreground',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  };

  const sizes = {
    default: 'h-10 px-4 py-2',
    sm: 'h-9 rounded-md px-3',
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Select = ({ children, value, onValueChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const handleSelect = (newValue) => {
    setSelectedValue(newValue);
    onValueChange(newValue);
    setIsOpen(false);
  };

  return (
    <div className='relative'>
      {children.map((child) => {
        if (child.type === SelectTrigger) {
          return React.cloneElement(child, {
            key: 'trigger',
            onClick: () => setIsOpen(!isOpen),
            selectedValue,
          });
        }
        if (child.type === SelectContent && isOpen) {
          return React.cloneElement(child, {
            key: 'content',
            onSelect: handleSelect,
            onClose: () => setIsOpen(false),
          });
        }
        return null;
      })}
    </div>
  );
};

const SelectTrigger = ({ children, className = '', onClick, selectedValue }) => (
  <button
    className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    onClick={onClick}
  >
    {children}
    <svg className='h-4 w-4 opacity-50' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path d='m6 9 6 6 6-6' />
    </svg>
  </button>
);

const SelectValue = ({ placeholder }) => (
  <span className='text-muted-foreground'>{placeholder}</span>
);

const SelectContent = ({ children, className = '', onSelect, onClose }) => (
  <div
    className={`absolute top-full left-0 z-50 w-full mt-1 rounded-md border bg-popover p-1 text-popover-foreground shadow-md ${className}`}
  >
    {React.Children.map(children, (child) => React.cloneElement(child, { onSelect, onClose }))}
  </div>
);

const SelectItem = ({ children, value, onSelect }) => (
  <div
    className='relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer'
    onClick={() => onSelect(value)}
  >
    {children}
  </div>
);

// Main Component
const parceiros = [
  {
    id: 1,
    nome: 'Bistrô Gourmet',
    categoria: 'restaurante',
    descricao: 'Experiência gastronómica com 20% de desconto para colaboradores',
    termos: 'Válido apenas para jantar, exclui bebidas alcoólicas. Máximo 4 pessoas.',
    desconto: '20% desconto',
    validade: 'Válido até 31/12/2023',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUqwhOgesbFE5DTOeEfih7JUKmgFrF6-71ZA&s',
  },
  {
    id: 2,
    nome: 'Spa Urbano',
    categoria: 'beleza',
    descricao: 'Tratamentos de spa relaxantes com preços especiais',
    termos: 'Válido para todos os tratamentos exceto pacotes. Uma utilização por colaborador.',
    desconto: '15% desconto',
    validade: 'Válido até 30/06/2024',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjKe-usqONXqwLqvY0EzVKvm2EcdZutcCEHQ&s',
  },
  {
    id: 3,
    nome: 'Tech Haven',
    categoria: 'retalho',
    descricao: 'Eletrónica e gadgets com preços especiais para colaboradores',
    termos: 'Válido apenas para artigos em stock. Não acumulável com outras promoções.',
    desconto: '10% desconto',
    validade: 'Sem data de expiração',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmgG1nsVts6qzpt5uaQ_Kq8qOSe5XPohJ4Ug&s',
  },
  {
    id: 4,
    nome: 'Skyline Viagens',
    categoria: 'viagens',
    descricao: 'Pacotes de férias com descontos para colaboradores',
    termos: 'Válido para reservas feitas com pelo menos 30 dias de antecedência.',
    desconto: '12% desconto',
    validade: 'Válido até 31/12/2023',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR4TcaReLwcwjWd1zDX4mwZXFEAVgntisYsQ&s',
  },
  {
    id: 5,
    nome: 'Palácio da Pasta',
    categoria: 'restaurante',
    descricao: 'Cozinha italiana autêntica com benefícios para colaboradores',
    termos: 'Válido para almoço e jantar. Inclui uma entrada gratuita.',
    desconto: '15% desconto',
    validade: 'Válido até 30/09/2023',
    img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSR4TcaReLwcwjWd1zDX4mwZXFEAVgntisYsQ&s',
  },
  {
    id: 6,
    nome: 'Salão Glow',
    categoria: 'beleza',
    descricao: 'Serviços de cabeleireiro e beleza a preços especiais',
    termos: 'Válido de terça a quinta-feira. Inclui consulta gratuita.',
    desconto: '25% desconto',
    validade: 'Válido até 31/03/2024',
    img: 'https://res.cloudinary.com/odisseias/image/upload/w_800,c_limit,f_auto,q_auto/img/promos/aventura-a-dois-pack-presente-para-duas-pessoas-capa_F.jpg',
  },
];

const Home = () => {
  const [parceiroSelecionado, setParceiroSelecionado] = useState(null);
  const [voucherGerado, setVoucherGerado] = useState(false);
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('todos');

  const parceirosFiltrados = parceiros.filter((parceiro) => {
    const correspondePesquisa =
      parceiro.nome.toLowerCase().includes(termoPesquisa.toLowerCase()) ||
      parceiro.descricao.toLowerCase().includes(termoPesquisa.toLowerCase());
    const correspondeCategoria =
      filtroCategoria === 'todos' || parceiro.categoria === filtroCategoria;
    return correspondePesquisa && correspondeCategoria;
  });

  const gerarVoucher = () => {
    setVoucherGerado(true);
  };

  const resetarVisualizacao = () => {
    setParceiroSelecionado(null);
    setVoucherGerado(false);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white border-b border-gray-200 py-6 shadow-sm'>
        <div className='max-w-7xl mx-auto px-4'>
          <h1 className='text-2xl font-semibold text-gray-900'>Portal de Parcerias</h1>
          <p className='mt-1 text-gray-500'>Benefícios exclusivos para os nossos colaboradores</p>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 py-8'>
        {parceiroSelecionado ? (
          <div className='max-w-4xl mx-auto'>
            <Button
              variant='ghost'
              onClick={resetarVisualizacao}
              className='mb-6 -ml-3 text-gray-600 hover:bg-gray-100'
            >
              <ArrowLeft className='mr-2 h-4 w-4' /> Voltar aos parceiros
            </Button>

            {!voucherGerado ? (
              <Card className='border-gray-200 shadow-none'>
                <CardHeader>
                  <CardTitle className='text-xl font-medium'>{parceiroSelecionado.nome}</CardTitle>
                  <CardDescription className='capitalize text-gray-500'>
                    {parceiroSelecionado.categoria}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='grid md:grid-cols-2 gap-8'>
                    <div>
                      <div className='bg-gray-100 rounded-xl w-full h-64 mb-6 flex items-center justify-center'>
                        <img
                          src={parceiroSelecionado.img}
                          alt={parceiroSelecionado.nome}
                          className='h-full object-contain rounded-lg'
                        />
                      </div>

                      <h3 className='font-medium mb-2 text-gray-900'>Descrição</h3>
                      <p className='text-gray-600 mb-6'>{parceiroSelecionado.descricao}</p>
                    </div>
                    <div>
                      <h3 className='font-medium mb-2 text-gray-900'>Detalhes da Oferta</h3>
                      <p className='text-gray-600 mb-4'>
                        <span className='font-medium'>Desconto:</span>{' '}
                        {parceiroSelecionado.desconto}
                      </p>
                      <p className='text-gray-600 mb-4'>
                        <span className='font-medium'>Validade:</span>{' '}
                        {parceiroSelecionado.validade}
                      </p>

                      <h3 className='font-medium mb-2 mt-6 text-gray-900'>Termos e Condições</h3>
                      <p className='text-gray-600'>{parceiroSelecionado.termos}</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-end'>
                  <Button
                    onClick={gerarVoucher}
                    className='bg-gray-900 hover:bg-gray-800 text-white'
                  >
                    Gerar Voucher
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <Card className='border-gray-200 shadow-none'>
                <CardHeader>
                  <CardTitle className='text-xl font-medium'>O Seu Voucher</CardTitle>
                  <CardDescription className='text-gray-500'>
                    Apresente este voucher no(a) {parceiroSelecionado.nome} para usufruir da sua
                    oferta
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className='border border-gray-200 rounded-lg p-8 bg-gray-50'>
                    <div className='flex justify-between items-start mb-8'>
                      <div>
                        <h2 className='text-xl font-medium text-gray-900'>
                          {parceiroSelecionado.nome}
                        </h2>
                        <p className='text-gray-500 capitalize'>{parceiroSelecionado.categoria}</p>
                      </div>
                      <div className='bg-gray-900 text-white px-4 py-2 rounded-lg font-medium'>
                        {parceiroSelecionado.desconto}
                      </div>
                    </div>

                    <div className='grid md:grid-cols-2 gap-8 mb-8'>
                      <div>
                        <h3 className='font-medium mb-2 text-gray-900'>Válido Até</h3>
                        <p className='text-gray-600'>{parceiroSelecionado.validade}</p>
                      </div>
                      <div>
                        <h3 className='font-medium mb-2 text-gray-900'>Termos</h3>
                        <p className='text-gray-600'>{parceiroSelecionado.termos}</p>
                      </div>
                    </div>

                    <div className='mt-8 text-center text-sm text-gray-400'>
                      ID Colaborador: ###### • Válido apenas no(a) {parceiroSelecionado.nome}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className='flex justify-between'>
                  <Button
                    variant='ghost'
                    onClick={() => setVoucherGerado(false)}
                    className='text-gray-600 hover:bg-gray-100'
                  >
                    Voltar aos Detalhes
                  </Button>
                  <Button className='bg-gray-900 hover:bg-gray-800 text-white'>
                    <Download className='mr-2 h-4 w-4' /> Transferir Voucher
                  </Button>
                </CardFooter>
              </Card>
            )}
          </div>
        ) : (
          <div>
            {/* Search Bar */}
            <div className='flex flex-col md:flex-row gap-4 mb-8'>
              <div className='relative flex-1'>
                <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                <Input
                  placeholder='Pesquisar parceiros...'
                  className='pl-10 bg-white border-gray-300 focus:border-gray-400'
                  value={termoPesquisa}
                  onChange={(e) => setTermoPesquisa(e.target.value)}
                />
              </div>
              <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                <SelectTrigger className='w-48 bg-white border-gray-300 focus:border-gray-400'>
                  <div className='flex items-center'>
                    <Filter className='mr-2 h-4 w-4 text-gray-400' />
                    <SelectValue placeholder='Filtrar por categoria' />
                  </div>
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-200'>
                  <SelectItem value='todos'>Todas Categorias</SelectItem>
                  <SelectItem value='restaurante'>Restaurantes</SelectItem>
                  <SelectItem value='beleza'>Beleza</SelectItem>
                  <SelectItem value='retalho'>Retalho</SelectItem>
                  <SelectItem value='viagens'>Viagens</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {parceirosFiltrados.length > 0 ? (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {parceirosFiltrados.map((parceiro) => (
                  <Card
                    key={parceiro.id}
                    className='border-gray-200 hover:shadow-md transition-shadow cursor-pointer bg-white'
                    onClick={() => setParceiroSelecionado(parceiro)}
                  >
                    <CardHeader>
                      <CardTitle className='text-lg font-medium'>{parceiro.nome}</CardTitle>
                      <CardDescription className='capitalize text-gray-500'>
                        {parceiro.categoria}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className='bg-gray-100 rounded-xl w-full h-64 mb-6 flex items-center justify-center'>
                        <img
                          src={parceiro.img}
                          alt={parceiro.nome}
                          className='h-full object-contain rounded-lg'
                        />
                      </div>

                      <p className='text-gray-600 text-sm line-clamp-2'>{parceiro.descricao}</p>
                    </CardContent>
                    <CardFooter className='flex justify-between items-center'>
                      <span className='text-sm font-medium text-gray-900'>{parceiro.desconto}</span>
                      <Button
                        variant='outline'
                        size='sm'
                        className='border-gray-300 text-gray-600 hover:bg-gray-50'
                      >
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className='text-center py-12'>
                <p className='text-gray-500'>
                  Nenhum parceiro corresponde aos critérios de pesquisa
                </p>
                <Button
                  variant='ghost'
                  className='mt-4 text-gray-600 hover:bg-gray-100'
                  onClick={() => {
                    setTermoPesquisa('');
                    setFiltroCategoria('todos');
                  }}
                >
                  Limpar filtros
                </Button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className='bg-white border-t border-gray-200 py-6 mt-12'>
        <div className='max-w-7xl mx-auto px-4 text-center text-sm text-gray-500'>
          <p>© {new Date().getFullYear()} Programa de Parcerias. Todos os direitos reservados.</p>
          <p className='mt-1'>Para assistência, contacte RH através de rh@torrestir.com</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
