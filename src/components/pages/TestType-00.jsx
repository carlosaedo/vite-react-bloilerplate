import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import authCheckLoginStatus from '../../utils/authCheckLoginStatus';
import Modal from '../TestType00-Modal/Modal';
import ModalDeleteRow from '../TestType00-Modal/ModalDeleteRow';
import { useTheme } from '@mui/material/styles';
import {
  IconButton,
  Popper,
  Grow,
  ClickAwayListener,
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  useMediaQuery,
} from '@mui/material';

import { dateFieldsArray } from '../../config/componentsSpecialConfigurations';

import getLastFridayOfPreviousWeek from '../../utils/getTheFridayDayFromLastWeek.util';

import { Visibility } from '@mui/icons-material';

import api from '../api/api';

const TestType = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigateTo = useNavigate();

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const autoTableHeight = window.visualViewport.height - (isMobile ? 540 : 290);
  console.log('Nani: ', autoTableHeight);
  const [tableHeight, setTableHeight] = useState(() => {
    const savedState = localStorage.getItem('tableHeight');
    return savedState ? parseInt(savedState, 10) : 400;
  });

  const [autoTableHeightFlag, setAutoTableHeightFlag] = useState(() => {
    const savedState = localStorage.getItem('tableHeightAuto');
    return savedState ? savedState : false;
  });

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isModalDeleteRowOpen, setIsModalDeleteRowOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const savedState = localStorage.getItem('tablePageSize');
    return savedState ? parseInt(savedState, 10) : 15;
  });
  const [inputPage, setInputPage] = useState(currentPage);

  const [selectedDate, setSelectedDate] = useState('');
  const [startupDateFirstTime, setStartupDateFirstTime] = useState(true);

  const [contextMenu, setContextMenu] = useState(null); // { x, y, rowIndex }

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleContextMenu = (event, row) => {
    event.preventDefault();
    setContextMenu({
      x: event.pageX,
      y: event.pageY,
      row,
    });
  };

  const handleTableHeightChange = (height, autoFlag) => {
    setTableHeight(height);
    localStorage.setItem('tableHeight', height);
    if (autoFlag) {
      localStorage.setItem('tableHeightAuto', true);
      setAutoTableHeightFlag(true);
    } else {
      localStorage.removeItem('tableHeightAuto');
      setAutoTableHeightFlag(false);
    }
  };

  const handleDelete = (row) => {
    //const updatedData = data.filter((_, index) => index !== contextMenu.rowIndex);
    //setData(updatedData);
    setSelectedRow(row);
    setIsModalDeleteRowOpen(true);
    setContextMenu(null);
  };

  const handleClickOutside = () => {
    setContextMenu(null);
  };

  async function fetchData() {
    try {
      const response = await api.get(`/test-type-00`, {
        params: {
          page: currentPage,
          pageSize: pageSize,
          selectedDate: selectedDate,
        },
      });

      if (response && response.data && response.data.data) {
        setData(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // Run on mount: check login and set startup date
    async function checkLoginStatus() {
      const loginStatus = await authCheckLoginStatus();

      if (!loginStatus) {
        navigateTo('/login');
      }
    }

    checkLoginStatus();
    if (autoTableHeightFlag) {
      handleTableHeightChange(autoTableHeight, true);
    }
  }, []); // Only on initial mount

  useEffect(() => {
    if (startupDateFirstTime) {
      const friday = getLastFridayOfPreviousWeek();
      setSelectedDate(friday);
      setStartupDateFirstTime(false);
    }
  }, [startupDateFirstTime]);

  useEffect(() => {
    if (selectedDate) {
      fetchData();
    }
  }, [selectedDate, currentPage, pageSize]);

  useEffect(() => {
    // Re-fetch data when selectedDate, page, or page size changes
    fetchData();
  }, [currentPage, pageSize, selectedDate]);

  useEffect(() => {
    // Attach click listener for context menu
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      // Try to parse as date
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      const isDate = !isNaN(aDate) && !isNaN(bDate);

      let comparison = 0;
      if (isDate) {
        comparison = aDate - bDate;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else {
        comparison = aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const handleHeaderClick = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  const handleRowDoubleClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const closeModalDeleteRow = () => {
    setIsModalDeleteRowOpen(false);
  };

  const handlePerPageChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
    localStorage.setItem('tablePageSize', newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
    setInputPage(1); // Reset input to first page
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      setInputPage(page); // Update input field to match the new page
    }
  };

  const generatePageNumbers = () => {
    const pageNumbers = [];
    let start = Math.max(1, currentPage - 2); // Start from 2 pages before current
    let end = Math.min(totalPages, currentPage + 2); // End at 2 pages after current

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // If there are pages before the start, add the ellipsis (but not as clickable)
    if (start > 1) {
      pageNumbers.unshift(
        <span key='ellipsis-start' className='pagination-ellipsis'>
          ...
        </span>,
      );
    }

    // If there are pages after the end, add the ellipsis (but not as clickable)
    if (end < totalPages) {
      pageNumbers.push(
        <span key='ellipsis-end' className='pagination-ellipsis'>
          ...
        </span>,
      );
    }

    return pageNumbers;
  };

  const handleInputChange = (e) => {
    setInputPage(e.target.value);
  };

  const handleJumpToPage = () => {
    const parsed = parseInt(inputPage, 10);
    if (isNaN(parsed)) return;
    const pageNumber = Math.max(1, Math.min(totalPages, parsed));
    handlePageChange(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const headers = data.length ? Object.keys(data[0]) : [];

  const dateFields = dateFieldsArray;

  const tableSizes = [autoTableHeight, 300, 400, 500, 600, 700, 800, 900, 1000, 1100];
  const tableSizeLabels = [
    'Auto',
    'Tiny',
    'Small',
    'Compact',
    'Medium',
    'Large',
    'Spacious',
    'Extra Large',
    'Jumbo',
    'Max',
  ];

  return (
    <>
      {error && (
        <Alert severity='error' onClose={() => setError(null)}>
          {error}
        </Alert>
      )}
      <Box
        sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          height: isMobile ? 'auto' : 80,
          maxWidth: 800,
          margin: '0 auto',
          padding: 2,
          flexWrap: 'wrap', // optional, keeps it safer on small-mid screens
          textAlign: isMobile ? 'center' : 'left',
        }}
      >
        <Typography sx={{ marginRight: '50px' }} variant='h5' gutterBottom>
          Titulo da página
        </Typography>

        <Typography variant='subtitle1'>Select a date:</Typography>

        <TextField
          type='date'
          value={selectedDate}
          onChange={handleDateChange}
          slotProps={{ inputLabel: { shrink: true } }}
          size='small'
        />

        {selectedDate && (
          <Typography variant='body1'>
            <strong>Selected:</strong> {selectedDate}
          </Typography>
        )}
      </Box>
      <Box sx={{ padding: 2 }}>
        {data.length === 0 ? (
          <Typography>No data to show</Typography>
        ) : (
          <TableContainer
            component={Paper}
            sx={{
              height: tableHeight,
              overflow: 'auto',
            }}
          >
            <Table stickyHeader size='small'>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableCell
                      key={header}
                      onClick={() => handleHeaderClick(header)}
                      sx={{
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        backgroundColor: '#fff', // important for sticky visibility
                        position: 'sticky',
                        top: 0,
                        zIndex: 1,
                      }}
                    >
                      {header.toUpperCase()}
                      {sortConfig.key === header && (
                        <span>{sortConfig.direction === 'asc' ? ' 🔼' : ' 🔽'}</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.map((row, index) => (
                  <TableRow
                    key={row.id || index}
                    hover
                    onDoubleClick={() => handleRowDoubleClick(row)}
                    onContextMenu={(e) => handleContextMenu(e, row)}
                  >
                    {headers.map((header) => (
                      <TableCell key={header}>
                        {dateFields.includes(header)
                          ? new Intl.DateTimeFormat('pt-PT').format(new Date(row[header]))
                          : row[header]}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
      {contextMenu && (
        <Box
          sx={{
            position: 'absolute',
            top: contextMenu.y,
            left: contextMenu.x,
            bgcolor: 'background.paper',
            boxShadow: 2,
            zIndex: 1000,
            borderRadius: 1,
          }}
        >
          <Button onClick={() => handleDelete(contextMenu.row)} size='small'>
            Delete row
          </Button>
        </Box>
      )}
      <Modal isOpen={isModalOpen} closeModal={closeModal} data={selectedRow} onUpdate={fetchData} />
      <ModalDeleteRow
        isOpenDeleteRow={isModalDeleteRowOpen}
        closeModalDeleteRow={closeModalDeleteRow}
        data={selectedRow}
        onUpdate={fetchData}
      />
      {/* Pagination Controls */}
      <Box sx={{ padding: 2, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Button
          variant='outlined'
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &laquo; Previous
        </Button>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {generatePageNumbers().map((page, index) => (
            <Button
              key={index}
              variant={page === currentPage ? 'contained' : 'text'}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              color={page === currentPage ? 'primary' : 'inherit'}
              size='small'
            >
              {page}
            </Button>
          ))}
        </Box>
        <TextField
          type='number'
          value={inputPage}
          onChange={handleInputChange}
          onBlur={handleJumpToPage}
          slotProps={{
            htmlInput: {
              min: 1,
              max: totalPages,
            },
          }}
          size='small'
          label='Go to page'
          sx={{ width: 120 }}
        />
        <Button
          variant='outlined'
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </Button>
        <FormControl size='small'>
          <InputLabel>Rows per page</InputLabel>
          <Select value={pageSize} label='Rows per page' onChange={handlePerPageChange}>
            {[10, 15, 20, 25, 30, 40, 50, 75, 100].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        Table Height
        <Box>
          <IconButton ref={anchorRef} onClick={handleToggle}>
            {open ? <Visibility size={20} /> : <Visibility size={20} />}
          </IconButton>

          <Popper
            open={open}
            anchorEl={anchorRef.current}
            placement='bottom-start'
            transition
            disablePortal
            sx={{ zIndex: 9999999 }}
          >
            {({ TransitionProps }) => (
              <Grow {...TransitionProps}>
                <Paper sx={{ p: 1 }}>
                  <ClickAwayListener onClickAway={handleClose}>
                    <Box display='grid' flexWrap='wrap' gap={1} width={150}>
                      {tableSizes.map((size, index) => (
                        <Button
                          fullWidth
                          key={size}
                          variant={
                            autoTableHeightFlag && tableSizeLabels[index] === 'Auto'
                              ? 'contained'
                              : tableHeight === size
                              ? 'contained'
                              : 'outlined'
                          }
                          onClick={() => {
                            handleTableHeightChange(size, tableSizeLabels[index] === 'Auto');
                            setOpen(false); // close menu after selection
                          }}
                        >
                          {tableSizeLabels[index]}
                        </Button>
                      ))}
                    </Box>
                  </ClickAwayListener>
                </Paper>
              </Grow>
            )}
          </Popper>
        </Box>
      </Box>
    </>
  );
};

export default TestType;
