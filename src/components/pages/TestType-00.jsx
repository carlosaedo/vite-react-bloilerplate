import React, { useState, useEffect } from 'react';
import Modal from '../TestType00-Modal/Modal';

import getLastFridayOfPreviousWeek from '../../utils/getTheFridayDayFromLastWeek.util';

import api from '../api/api';

import './TestType-00.css';

const TestType = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [inputPage, setInputPage] = useState(currentPage);

  const [selectedDate, setSelectedDate] = useState('');

  useEffect(() => {
    setSelectedDate(getLastFridayOfPreviousWeek());
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
          console.log(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage, pageSize, selectedDate]); // Re-fetch data when page changes

  const handleRowDoubleClick = (row) => {
    setSelectedRow(row);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePerPageChange = (e) => {
    const newPageSize = parseInt(e.target.value, 10);
    setPageSize(newPageSize);
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
    const pageNumber = Math.max(1, Math.min(totalPages, parseInt(inputPage, 10)));
    handlePageChange(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const headers = data.length ? Object.keys(data[0]) : [];

  return (
    <>
      <div style={{ padding: '1rem', fontFamily: 'Arial' }}>
        <label htmlFor='datePicker' style={{ marginRight: '1rem' }}>
          Select a date:
        </label>
        <input type='date' id='datePicker' value={selectedDate} onChange={handleDateChange} />
        {selectedDate && (
          <div style={{ marginTop: '1rem' }}>
            <strong>Selected date:</strong> {selectedDate}
          </div>
        )}
      </div>
      <div className='table-container'>
        {data.length === 0 ? (
          <p>No data to show</p>
        ) : (
          <table className='responsive-table'>
            <thead>
              <tr>
                {headers.map((header) => (
                  <th key={header}>{header.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index} onDoubleClick={() => handleRowDoubleClick(row)}>
                  {headers.map((header) => (
                    <td key={header} data-label={header}>
                      {row[header]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <Modal isOpen={isModalOpen} closeModal={closeModal} data={selectedRow} />
      </div>

      {/* Pagination Controls */}
      <div className='pagination'>
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          &laquo; Previous
        </button>

        <div className='page-numbers'>
          {generatePageNumbers().map((page, index) => (
            <span
              key={index}
              onClick={() => typeof page === 'number' && handlePageChange(page)}
              className={`page-number ${page === currentPage ? 'active' : ''}`}
            >
              {page}
            </span>
          ))}
        </div>

        <input
          type='number'
          value={inputPage}
          min='1'
          max={totalPages}
          onChange={handleInputChange}
          onBlur={handleJumpToPage}
          className='page-input'
        />

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next &raquo;
        </button>

        {/* Dropdown for page size selection */}
        <select value={pageSize} onChange={handlePerPageChange} className='page-size-dropdown'>
          {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map(
            (size) => (
              <option key={size} value={size}>
                {size} per page
              </option>
            ),
          )}
        </select>
      </div>
    </>
  );
};

export default TestType;
