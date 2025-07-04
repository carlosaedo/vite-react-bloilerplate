// src/components/pages/Waybills.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import apiTorrestir from '../api/torrestirApi.js'
import { useClient } from '../context/ClientContext'
import {  Calendar, Plus, X, RefreshCw, Truck, Package as PackageIcon, Scale, Tag, MapPin, ArrowRight, Hash } from 'lucide-react'
import {
  Box,
  Card,
  CardHeader,
  CardContent,
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
  CircularProgress,
} from '@mui/material'

// Map of statuses
const statusMap = {
  0: { label: 'Criado', color: 'default' },
  1: { label: 'Em Progresso', color: 'info' },
  2: { label: 'Fechado', color: 'success' },
  3: { label: 'Transmitido', color: 'secondary' },
  4: { label: 'Arquivado', color: 'warning' },
  9: { label: 'Cancelado', color: 'error' },
}

// Encomenda Card Component
function EncomendaCard({ encomenda, onClick, onDoubleClick }) {
  return (
      <Card variant="outlined" onClick={onClick} onDoubleClick={onDoubleClick} sx={{ cursor: 'pointer', mb: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography fontWeight="medium">{encomenda.trackingNumber}</Typography>
              <Typography variant="body2" color="text.secondary">
                {encomenda.pontoExpedicao && (
                    <>De: {encomenda.pontoExpedicao} ({encomenda.codigoPostalExpedicao} {encomenda.cidadeExpedicao})
                      <br /></>
                )}
                {encomenda.pontoEntrega && (
                    <>Para: {encomenda.pontoEntrega} ({encomenda.codigoPostalEntrega} {encomenda.cidadeEntrega})</>
                )}
              </Typography>
            </Box>
            <Typography variant="body2" textAlign="right">
              Pacotes: {encomenda.totalPacotes}
              <br /> Peso: {encomenda.totalPeso}kg
              <br /> CBM: {encomenda.totalCbm}
              <br /> LDM: {encomenda.totalLdm}
            </Typography>
          </Box>
        </CardContent>
      </Card>
  )
}

// List View Component
function ManifestoListView({
                             manifestos,
                             selectedClient,
                             loading,
                             error,
                             onRefresh,
                             onCreateNew,
                             onDoubleClick,
                           }) {
  const [filterDate, setFilterDate] = useState('')
  const [filterCamiao, setFilterCamiao] = useState('')
  const [filterTrator, setFilterTrator] = useState('')
  const [filterArmazem, setFilterArmazem] = useState('')
  const [selectedStatuses, setSelectedStatuses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filtered = manifestos.filter((m) => {
    const statusMatch =
        selectedStatuses.length === 0 || selectedStatuses.includes(m.status)
    return (
        (filterDate === '' ||
            m.dataExpedicao.toLocaleDateString('pt-PT').includes(filterDate)) &&
        (filterCamiao === '' ||
            m.matriculaCamiao.toLowerCase().includes(filterCamiao.toLowerCase())) &&
        (filterTrator === '' ||
            m.matriculaTrator.toLowerCase().includes(filterTrator.toLowerCase())) &&
        (filterArmazem === '' ||
            m.armazemExpedicao.toLowerCase().includes(filterArmazem.toLowerCase()) ||
            m.armazemDescarga.toLowerCase().includes(filterArmazem.toLowerCase())) &&
        statusMatch
    )
  })

  const totalPages = Math.ceil(filtered.length / itemsPerPage)
  const pageItems = filtered.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
  )

  const formatDate = (date) =>
      date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })

  const handleStatusSelect = (e) => {
    const v =
        typeof e.target.value === 'string'
            ? e.target.value.split(',').map(Number)
            : e.target.value
    setSelectedStatuses(v)
    setCurrentPage(1)
  }
  const resetFilters = () => {
    setFilterDate('')
    setFilterCamiao('')
    setFilterTrator('')
    setFilterArmazem('')
    setSelectedStatuses([])
    setCurrentPage(1)
  }

  return (
      <Box sx={{ p: 2 }}>
        <Box
            sx={{
              mb: 2,
              display: 'flex',
              justifyContent: 'space-between',
            }}
        >
          <Typography variant="h5">
            Manifestos de Carga
            {selectedClient && (
                <>
                  <br />
                  {selectedClient.name}
                </>
            )}
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
                onClick={onRefresh}
                startIcon={<RefreshCw />}
                disabled={loading}
            >
              Procurar Manifesto
            </Button>
            {loading && <CircularProgress size={24} />}
            <Button onClick={resetFilters}>Limpar</Button>
            <Button variant="contained" startIcon={<Plus />} onClick={onCreateNew}>
              Novo Manifesto
            </Button>
          </Box>
        </Box>

        {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
        )}

        {/* Filters Section */}
        <Box component={Paper} sx={{ p: 2, mb: 2 }}>
          <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: '1fr 1fr',
                  md: 'repeat(4,1fr)',
                },
              }}
          >
            <TextField
                label="Data"
                placeholder="DD/MM/YYYY"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
            />
            <TextField
                label="Camião"
                placeholder="Matrícula"
                value={filterCamiao}
                onChange={(e) => setFilterCamiao(e.target.value)}
            />
            <TextField
                label="Trator"
                placeholder="Matrícula"
                value={filterTrator}
                onChange={(e) => setFilterTrator(e.target.value)}
            />
            <FormControl>
              <InputLabel>Status</InputLabel>
              <Select
                  multiple
                  value={selectedStatuses}
                  onChange={handleStatusSelect}
                  renderValue={(sel) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {sel.map((v) => (
                            <Chip key={v} label={statusMap[v].label} />
                        ))}
                      </Box>
                  )}
              >
                {Object.entries(statusMap).map(([k, v]) => (
                    <MenuItem key={k} value={Number(k)}>
                      <Checkbox checked={selectedStatuses.includes(Number(k))} />
                      {v.label}
                    </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ mt: 2 }}>
            <TextField
                fullWidth
                label="Armazém (Exp./Desc.)"
                placeholder="Armazém"
                value={filterArmazem}
                onChange={(e) => setFilterArmazem(e.target.value)}
            />
          </Box>
        </Box>

        {/* Table Section */}
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
              {pageItems.length > 0 ? (
                  pageItems.map((m, idx) => (
                      <TableRow
                          key={`${m.id}-${idx}`}
                          hover
                          onDoubleClick={() => onDoubleClick(m)}
                          sx={{ cursor: 'pointer' }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Calendar size={16} sx={{ mr: 1 }} />
                            {formatDate(m.dataExpedicao)}
                          </Box>
                        </TableCell>
                        <TableCell>
                          Camião: {m.matriculaCamiao}
                          <br />
                          Trator: {m.matriculaTrator}
                        </TableCell>
                        <TableCell>
                          Exp: {m.armazemExpedicao}
                          <br />
                          Desc: {m.armazemDescarga}
                        </TableCell>
                        <TableCell>
                          Enc: {m.quantidadeEncomendas}
                          <br />
                          Vol: {m.quantidadeVolumes}
                        </TableCell>
                        <TableCell>
                          <Chip
                              label={statusMap[m.status].label}
                              size="small"
                              color={statusMap[m.status].color}
                          />
                        </TableCell>
                      </TableRow>
                  ))
              ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Nenhum manifesto encontrado
                    </TableCell>
                  </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
        >
          <Typography variant="body2">
            Mostrando{' '}
            {(currentPage - 1) * itemsPerPage + 1} a{' '}
            {Math.min(currentPage * itemsPerPage, filtered.length)} de{' '}
            {filtered.length}
          </Typography>
          <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(_, p) => setCurrentPage(p)}
              color="primary"
          />
        </Box>
      </Box>
  )
}

// Main Page Component
export default function WaybillsPage() {
  const { token } = useAuth()
  const { selectedClient } = useClient()
  const [view, setView] = useState('list')
  const [manifestos, setManifestos] = useState([])
  const [selectedManifesto, setSelectedManifesto] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // detalhe
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState(null)
  const [detailData, setDetailData] = useState(null)

  const [unassignedEncomendas, setUnassignedEncomendas] = useState([])
  const [unassignedLoading, setUnassignedLoading] = useState(false)
  const [unassignedError, setUnassignedError] = useState(null)

  // 1) Lista de manifestos
  async function fetchManifestos() {
    if (!selectedClient?.clientId) {
      setManifestos([])
      return
    }
    setLoading(true); setError(null)
    try {
      const { data } = await apiTorrestir.get(
          `/api/manifest?clientId=${selectedClient.clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      const parsed = data.map(item => ({
        id: item.manifestId,
        loadingPointId: item.loadingPointId,
        dataExpedicao: new Date(item.expeditionDate),
        matriculaCamiao: item.truckPlate,
        matriculaTrator: item.trailerPlate,
        armazemExpedicao: item.loadingPointName,
        armazemDescarga: item.unloadingPointName,
        quantidadeEncomendas: (item.lines || []).filter(l => l).length,
        quantidadeVolumes: (item.lines || []).filter(l => l).length,
        status: item.status,
        encomendas: [], // só pra compatibilidade
      }))
      setManifestos(parsed)
    } catch {
      setError('Não foi possível carregar manifestos')
    } finally {
      setLoading(false)
    }
  }

  // 2) Detalhes do manifesto
  async function fetchDetail(manifestId) {
    setDetailLoading(true); setDetailError(null)
    try {
      const { data } = await apiTorrestir.get(
          `/api/manifest/${manifestId}/details?clientId=${selectedClient.clientId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      setDetailData(data)
    } catch {
      setDetailError('Não foi possível carregar detalhes')
    } finally {
      setDetailLoading(false)
    }
  }

  // 3) Bookings disponíveis (não atribuídos)
  async function fetchUnassignedBookings(shippingPointId) {
    setUnassignedLoading(true); setUnassignedError(null)
    try {
      const { data } = await apiTorrestir.get(
          `/api/manifest/unassigned-bookings?clientId=${selectedClient.clientId}&shippingPoint=${shippingPointId}`,
          { headers: { Authorization: `Bearer ${token}` } }
      )
      const items = data.map(b => ({
        trackingNumber: b.trackingNo,
        pontoExpedicao: b.shipperName,
        codigoPostalExpedicao: b.shipperZip,
        cidadeExpedicao: b.shipperCity,
        pontoEntrega: b.consigneeName,
        codigoPostalEntrega: b.consigneeZip,
        cidadeEntrega: b.consigneeCity,
        totalPacotes: b.lines?.reduce((s,l) => s + (l.qty||0), 0) || 0,
        totalPeso:   b.lines?.reduce((s,l) => s + (l.gw ||0), 0) || 0,
        totalCbm:    b.lines?.reduce((s,l) => s + (l.cbm||0), 0) || 0,
        totalLdm:    b.lines?.reduce((s,l) => s + (l.ldm||0), 0) || 0,
      }))
      setUnassignedEncomendas(items)
    } catch {
      setUnassignedError('Não foi possível carregar bookings disponíveis')
    } finally {
      setUnassignedLoading(false)
    }
  }


  // on mount ou muda de client
  // efeitos
  useEffect(() => { fetchManifestos() }, [selectedClient])
  useEffect(() => {
    if (view === 'manage' && selectedManifesto) {
      fetchDetail(selectedManifesto.id)
      fetchUnassignedBookings(selectedManifesto.loadingPointId)
    }
  }, [view, selectedManifesto])

  // ações
  const handleCreateNew = () => {
    setSelectedManifesto({
      id: Math.max(0, ...manifestos.map(m => m.id)) + 1,
      loadingPointId: null,
      dataExpedicao: new Date(),
      matriculaCamiao: '',
      matriculaTrator: '',
      armazemExpedicao: '',
      armazemDescarga: '',
      quantidadeEncomendas: 0,
      quantidadeVolumes: 0,
      status: 0,
      encomendas: [],
    })
    setDetailData(null)
    setView('manage')
  }
  const handleDoubleClick = m => { setSelectedManifesto(m); setView('manage') }


  const toggleEncomenda = async (e) => {
    if (!selectedManifesto) return

    const isAssigned = detailData?.bookings?.some(
        (b) => b.trackingNo === e.trackingNumber
    )

    try {
      if (isAssigned) {
        // REMOVER do manifesto
        await apiTorrestir.delete(
            `/api/manifest/${selectedManifesto.id}/lines/${e.trackingNumber}`,
            { headers: { Authorization: `Bearer ${token}` } }
        )
      } else {
        // ADICIONAR ao manifesto
        await apiTorrestir.post(
            `/api/manifest/${selectedManifesto.id}/lines/${e.trackingNumber}`,
            null,
            { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      // Atualizar dados após qualquer alteração
      await fetchDetail(selectedManifesto.id)
      await fetchUnassignedBookings(selectedManifesto.loadingPointId)

    } catch (error) {
      console.error('Erro ao alterar encomenda no manifesto:', error)
      alert('Erro ao associar/remover encomenda no manifesto.')
    }
  }



  const saveManifesto = () => {
    setManifestos(prev =>
        prev.some(m => m.id === selectedManifesto.id)
            ? prev.map(m => m.id === selectedManifesto.id ? selectedManifesto : m)
            : [...prev, selectedManifesto]
    )
    setView('list')
  }
  const cancelEdit = () => setView('list')

  // ==== render ====
  if (view === 'list') {
    return (
        <ManifestoListView
            manifestos={manifestos}
            selectedClient={selectedClient}
            loading={loading}
            error={error}
            onRefresh={fetchManifestos}
            onCreateNew={handleCreateNew}
            onDoubleClick={handleDoubleClick}
        />
    )
  }

  // ==== gestão de manifesto ====
  return (
      <Box sx={{ p: 2 }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            {/* Summary estilo Apple */}
            {detailLoading ? (
                <CircularProgress size={24} />
            ) : detailError ? (
                <Typography color="error">{detailError}</Typography>
            ) : detailData ? (


                <Box
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      bgcolor: '#F5F5F7',   // tom suave de fundo estilo macOS
                      mb: 2,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                    }}
                >
                  {/* Linha 1 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Hash size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {detailData.manifest.manifestId}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Calendar size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {new Date(detailData.manifest.manifestDate).toLocaleDateString('pt-PT', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </Typography>
                    </Box>

                    {/* Camião / Trator */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Truck size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {selectedManifesto.matriculaCamiao} / {selectedManifesto.matriculaTrator}
                      </Typography>
                    </Box>

                    {/* Origem → Destino (com MapPin + ArrowRight) */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <MapPin size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {selectedManifesto.armazemExpedicao}
                      </Typography>
                      <ArrowRight size={16} />
                      <MapPin size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {selectedManifesto.armazemDescarga}
                      </Typography>
                    </Box>

                  </Box>

                  {/* Linha 2 – Apple-style com ícones */}
                  <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        flexWrap: 'wrap',
                      }}
                  >
                    {/* Total Bookings */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <PackageIcon size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {detailData.manifest.totalBookings} Bookings
                      </Typography>
                    </Box>

                    {/* Peso total */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Scale size={16} />
                      <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                        {detailData.bookings
                            .reduce(
                                (sum, b) =>
                                    sum +
                                    (b.lines?.reduce((s, l) => s + (l.gw || 0), 0) || 0),
                                0
                            )
                            .toFixed(2)}{' '}
                        kg
                      </Typography>
                    </Box>

                    {/* Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Tag size={16} />
                      <Chip
                          label={statusMap[Number(detailData.manifest.status)].label}
                          size="small"
                          color={statusMap[Number(detailData.manifest.status)].color}
                      />
                    </Box>
                  </Box>

                </Box>

            ) : null}

            {/* actions */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button startIcon={<X />} onClick={cancelEdit} sx={{ mr: 1 }}>
                Cancel
              </Button>
              <Button
                  variant="contained"
                  startIcon={<Plus />}
                  onClick={saveManifesto}
              >
                Save
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* duas colunas */}
        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {/* Encomendas no manifesto */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipment on Manifest
            </Typography>
            {detailData?.bookings?.length ? (
                detailData.bookings.map((b) => (
                    <EncomendaCard
                        key={b.trackingNo}
                        encomenda={{
                          trackingNumber: b.trackingNo,
                          totalPacotes: b.lines?.reduce((acc, l) => acc + l.qty, 0) || 0,
                          totalPeso: b.lines?.reduce((acc, l) => acc + l.gw, 0) || 0,
                          totalCbm: b.lines?.reduce((acc, l) => acc + l.cbm, 0) || 0,
                          totalLdm: b.lines?.reduce((acc, l) => acc + l.ldm, 0) || 0,
                          pontoExpedicao: b.shipperName,
                          codigoPostalExpedicao: b.shipperZip,
                          cidadeExpedicao: b.shipperCity,
                          pontoEntrega: b.consigneeName,
                          codigoPostalEntrega: b.consigneeZip,
                          cidadeEntrega: b.consigneeCity,
                        }}
                        onDoubleClick={() =>
                            toggleEncomenda({ trackingNumber: b.trackingNo, ...b })
                        }
                    />
                ))
            ) : (
                <Typography color="text.secondary">
                  No Shipment assigned
                </Typography>
            )}
          </Box>

          {/* Encomendas disponíveis */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Shipments to Assign
            </Typography>
            {unassignedLoading ? (
                <CircularProgress size={24} />
            ) : unassignedError ? (
                <Typography color="error">{unassignedError}</Typography>
            ) : unassignedEncomendas.length ? (
                unassignedEncomendas.map((e) => (
                    <EncomendaCard
                        key={e.trackingNumber}
                        encomenda={e}
                        onDoubleClick={() => toggleEncomenda(e)}
                    />
                ))
            ) : (
                <Typography color="text.secondary">
                  All Shipments Assigned
                </Typography>
            )}
          </Box>
        </Box>
      </Box>
  )
}
