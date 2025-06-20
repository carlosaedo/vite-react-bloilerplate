import React, { useState } from 'react';
import {
  Calendar,
  Filter as FilterIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Truck,
  Package,
  Box as PackageIcon,
  ArrowRight,
} from 'lucide-react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Chip,
  Divider,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from '@mui/material';

// Map of statuses
const statusMap = {
  0: { label: 'Criado', color: 'default' },
  1: { label: 'Em Progresso', color: 'info' },
  2: { label: 'Fechado', color: 'success' },
  3: { label: 'Transmitido', color: 'secondary' },
  4: { label: 'Arquivado', color: 'warning' },
  9: { label: 'Cancelado', color: 'error' },
};

// Sample data
const initialManifestos = [
  {
    id: 1,
    dataExpedicao: new Date('2023-06-15'),
    matriculaCamiao: 'AA-12-34',
    matriculaTrator: 'BB-56-78',
    armazemExpedicao: 'Armazém Norte',
    armazemDescarga: 'Armazém Sul',
    quantidadeEncomendas: 2,
    quantidadeVolumes: 120,
    status: 1,
    encomendas: [
      {
        trackingNumber: 'ABC-12345',
        pontoExpedicao: 'Loja Centro',
        codigoPostalExpedicao: '1000-001',
        cidadeExpedicao: 'Lisboa',
        pontoEntrega: 'Cliente Silva',
        codigoPostalEntrega: '2000-002',
        cidadeEntrega: 'Santarém',
        totalPacotes: 3,
        totalPeso: 15.5,
        totalCbm: 1.2,
        totalLdm: 0.8,
      },
      {
        trackingNumber: 'DEF-67890',
        pontoExpedicao: 'Armazém Norte',
        codigoPostalExpedicao: '1000-100',
        cidadeExpedicao: 'Lisboa',
        pontoEntrega: 'Cliente Santos',
        codigoPostalEntrega: '3000-003',
        cidadeEntrega: 'Coimbra',
        totalPacotes: 5,
        totalPeso: 22.0,
        totalCbm: 1.8,
        totalLdm: 1.2,
      },
    ],
  },
];

const availableEncomendas = [
  {
    trackingNumber: 'GHI-54321',
    pontoExpedicao: 'Loja Sul',
    codigoPostalExpedicao: '1500-001',
    cidadeExpedicao: 'Lisboa',
    pontoEntrega: 'Cliente Pereira',
    codigoPostalEntrega: '4000-004',
    cidadeEntrega: 'Porto',
    totalPacotes: 2,
    totalPeso: 8.5,
    totalCbm: 0.7,
    totalLdm: 0.5,
  },
];

// Encomenda Card Component
function EncomendaCard({ encomenda, onClick }) {
  return (
    <Card variant='outlined' onClick={onClick} sx={{ cursor: 'pointer', mb: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography fontWeight='medium'>{encomenda.trackingNumber}</Typography>
            <Typography variant='body2' color='text.secondary'>
              De: {encomenda.pontoExpedicao} ({encomenda.codigoPostalExpedicao}{' '}
              {encomenda.cidadeExpedicao})
              <br />
              Para: {encomenda.pontoEntrega} ({encomenda.codigoPostalEntrega}{' '}
              {encomenda.cidadeEntrega})
            </Typography>
          </Box>
          <Typography variant='body2' textAlign='right'>
            Pacotes: {encomenda.totalPacotes}
            <br /> Peso: {encomenda.totalPeso}kg
            <br /> CBM: {encomenda.totalCbm}
            <br /> LDM: {encomenda.totalLdm}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

// List View Component
function ManifestoListView({ manifestos, onCreateNew, onDoubleClick }) {
  const [filterDate, setFilterDate] = useState('');
  const [filterCamiao, setFilterCamiao] = useState('');
  const [filterTrator, setFilterTrator] = useState('');
  const [filterArmazem, setFilterArmazem] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredManifestos = manifestos.filter((manifesto) => {
    const statusMatch =
      selectedStatuses.length === 0 || selectedStatuses.includes(manifesto.status);
    return (
      (filterDate === '' ||
        manifesto.dataExpedicao.toLocaleDateString('pt-PT').includes(filterDate)) &&
      (filterCamiao === '' ||
        manifesto.matriculaCamiao.toLowerCase().includes(filterCamiao.toLowerCase())) &&
      (filterTrator === '' ||
        manifesto.matriculaTrator.toLowerCase().includes(filterTrator.toLowerCase())) &&
      (filterArmazem === '' ||
        manifesto.armazemExpedicao.toLowerCase().includes(filterArmazem.toLowerCase()) ||
        manifesto.armazemDescarga.toLowerCase().includes(filterArmazem.toLowerCase())) &&
      statusMatch
    );
  });

  const totalPages = Math.ceil(filteredManifestos.length / itemsPerPage);
  const paginatedManifestos = filteredManifestos.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const formatDate = (date) =>
    date.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const handleStatusSelect = (event) => {
    setSelectedStatuses(
      typeof event.target.value === 'string'
        ? event.target.value.split(',').map(Number)
        : event.target.value,
    );
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterDate('');
    setFilterCamiao('');
    setFilterTrator('');
    setFilterArmazem('');
    setSelectedStatuses([]);
    setCurrentPage(1);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant='h5'>Manifestos de Carga</Typography>
        <Box>
          <Button onClick={resetFilters} sx={{ mr: 1 }}>
            Limpar
          </Button>
          <Button variant='contained' startIcon={<Plus />} onClick={onCreateNew}>
            Novo Manifesto
          </Button>
        </Box>
      </Box>

      <Box component={Paper} sx={{ p: 2, mb: 2 }}>
        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' },
          }}
        >
          <TextField
            label='Data'
            placeholder='DD/MM/YYYY'
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
          />
          <TextField
            label='Matrícula Camião'
            placeholder='Camião'
            value={filterCamiao}
            onChange={(e) => setFilterCamiao(e.target.value)}
          />
          <TextField
            label='Matrícula Trator'
            placeholder='Trator'
            value={filterTrator}
            onChange={(e) => setFilterTrator(e.target.value)}
          />
          <FormControl>
            <InputLabel>Status</InputLabel>
            <Select
              multiple
              value={selectedStatuses}
              onChange={handleStatusSelect}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={statusMap[value].label} />
                  ))}
                </Box>
              )}
            >
              {Object.entries(statusMap).map(([key, val]) => (
                <MenuItem key={key} value={Number(key)}>
                  <Checkbox checked={selectedStatuses.includes(Number(key))} />
                  {val.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label='Armazém (expedição/descarga)'
            placeholder='Armazém'
            value={filterArmazem}
            onChange={(e) => setFilterArmazem(e.target.value)}
          />
        </Box>
      </Box>

      <TableContainer component={Paper} sx={{ mb: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Data</TableCell>
              <TableCell>Matrículas</TableCell>
              <TableCell>Armazéns</TableCell>
              <TableCell>Quantidades</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedManifestos.length > 0 ? (
              paginatedManifestos.map((manifesto) => (
                <TableRow
                  key={manifesto.id}
                  hover
                  onDoubleClick={() => onDoubleClick(manifesto)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Calendar fontSize='small' sx={{ mr: 1 }} />
                      {formatDate(manifesto.dataExpedicao)}
                    </Box>
                  </TableCell>
                  <TableCell>
                    Camião: {manifesto.matriculaCamiao}
                    <br />
                    Trator: {manifesto.matriculaTrator}
                  </TableCell>
                  <TableCell>
                    Exp: {manifesto.armazemExpedicao}
                    <br />
                    Desc: {manifesto.armazemDescarga}
                  </TableCell>
                  <TableCell>
                    Enc: {manifesto.quantidadeEncomendas}
                    <br />
                    Vol: {manifesto.quantidadeVolumes}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={statusMap[manifesto.status].label}
                      color={statusMap[manifesto.status].color}
                      size='small'
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align='center'>
                  Nenhum manifesto encontrado
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='body2'>
          Mostrando {(currentPage - 1) * itemsPerPage + 1} a{' '}
          {Math.min(currentPage * itemsPerPage, filteredManifestos.length)} de{' '}
          {filteredManifestos.length}
        </Typography>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => setCurrentPage(page)}
          color='primary'
        />
      </Box>
    </Box>
  );
}

// Main Page Component
export default function WaybillsPage() {
  const [view, setView] = useState('list');
  const [selectedManifesto, setSelectedManifesto] = useState(null);
  const [manifestos, setManifestos] = useState(initialManifestos);
  const [unassignedEncomendas, setUnassignedEncomendas] = useState(availableEncomendas);

  const handleCreateNew = () => {
    const newManifesto = {
      id: Math.max(...manifestos.map((m) => m.id), 0) + 1,
      dataExpedicao: new Date(),
      matriculaCamiao: '',
      matriculaTrator: '',
      armazemExpedicao: '',
      armazemDescarga: '',
      quantidadeEncomendas: 0,
      quantidadeVolumes: 0,
      status: 0,
      encomendas: [],
    };
    setSelectedManifesto(newManifesto);
    setView('manage');
  };

  const handleDoubleClick = (manifesto) => {
    setSelectedManifesto(manifesto);
    setView('manage');
  };

  const toggleEncomenda = (encomenda) => {
    if (!selectedManifesto) return;
    const isAssigned = selectedManifesto.encomendas.some(
      (e) => e.trackingNumber === encomenda.trackingNumber,
    );
    if (isAssigned) {
      setSelectedManifesto((prev) => ({
        ...prev,
        encomendas: prev.encomendas.filter((e) => e.trackingNumber !== encomenda.trackingNumber),
        quantidadeEncomendas: prev.encomendas.length - 1,
      }));
      setUnassignedEncomendas((prev) => [...prev, encomenda]);
    } else {
      setSelectedManifesto((prev) => ({
        ...prev,
        encomendas: [...prev.encomendas, encomenda],
        quantidadeEncomendas: prev.encomendas.length + 1,
      }));
      setUnassignedEncomendas((prev) =>
        prev.filter((e) => e.trackingNumber !== encomenda.trackingNumber),
      );
    }
  };

  const saveManifesto = () => {
    if (!selectedManifesto) return;
    if (selectedManifesto.id > Math.max(...manifestos.map((m) => m.id), 0)) {
      setManifestos((prev) => [...prev, selectedManifesto]);
    } else {
      setManifestos((prev) =>
        prev.map((m) => (m.id === selectedManifesto.id ? selectedManifesto : m)),
      );
    }
    setView('list');
  };

  const cancelEdit = () => setView('list');

  if (view === 'list') {
    return (
      <ManifestoListView
        manifestos={manifestos}
        onCreateNew={handleCreateNew}
        onDoubleClick={handleDoubleClick}
      />
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Card>
        <CardHeader
          title='Gestão de Manifesto'
          action={
            <Box>
              <Button startIcon={<X />} onClick={cancelEdit} sx={{ mr: 1 }}>
                Cancelar
              </Button>
              <Button variant='contained' startIcon={<Plus />} onClick={saveManifesto}>
                Guardar
              </Button>
            </Box>
          }
        />
        <CardContent>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label='Data de Expedição'
              type='date'
              value={selectedManifesto?.dataExpedicao.toISOString().slice(0, 10)}
              onChange={(e) =>
                setSelectedManifesto((prev) => ({
                  ...prev,
                  dataExpedicao: new Date(e.target.value),
                }))
              }
              InputLabelProps={{ shrink: true }}
            />
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                label='Status'
                value={selectedManifesto?.status ?? 0}
                onChange={(e) =>
                  setSelectedManifesto((prev) => ({
                    ...prev,
                    status: Number(e.target.value),
                  }))
                }
              >
                {Object.entries(statusMap).map(([key, val]) => (
                  <MenuItem key={key} value={Number(key)}>
                    {val.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label='Matrícula Camião'
              value={selectedManifesto?.matriculaCamiao}
              onChange={(e) =>
                setSelectedManifesto((prev) => ({ ...prev, matriculaCamiao: e.target.value }))
              }
            />
            <TextField
              label='Matrícula Trator'
              value={selectedManifesto?.matriculaTrator}
              onChange={(e) =>
                setSelectedManifesto((prev) => ({ ...prev, matriculaTrator: e.target.value }))
              }
            />
            <TextField
              label='Armazém de Expedição'
              value={selectedManifesto?.armazemExpedicao}
              onChange={(e) =>
                setSelectedManifesto((prev) => ({ ...prev, armazemExpedicao: e.target.value }))
              }
            />
            <TextField
              label='Armazém de Descarga'
              value={selectedManifesto?.armazemDescarga}
              onChange={(e) =>
                setSelected.Manifesto((prev) => ({ ...prev, armazemDescarga: e.target.value }))
              }
            />
          </Box>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant='h6'>Encomendas no Manifesto</Typography>
                <Chip label={`${selectedManifesto.encomendas.length} encomendas`} />
              </Box>
              {selectedManifesto.encomendas.length > 0 ? (
                selectedManifesto.encomendas.map((e) => (
                  <EncomendaCard
                    key={e.trackingNumber}
                    encomenda={e}
                    onClick={() => toggleEncomenda(e)}
                  />
                ))
              ) : (
                <Typography color='text.secondary' align='center'>
                  Nenhuma encomenda associada
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant='h6'>Encomendas Disponíveis</Typography>
                <Chip label={`${unassignedEncomendas.length} encomendas`} />
              </Box>
              {unassignedEncomendas.length > 0 ? (
                unassignedEncomendas.map((e) => (
                  <EncomendaCard
                    key={e.trackingNumber}
                    encomenda={e}
                    onClick={() => toggleEncomenda(e)}
                  />
                ))
              ) : (
                <Typography color='text.secondary' align='center'>
                  Todas encomendas associadas
                </Typography>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
