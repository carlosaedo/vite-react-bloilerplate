import { useState, useEffect } from 'react';
import './PersonalKitForm.css'; // Import the CSS file

import { useApi } from '../../context/ApiContext'; // Import context hook

const PersonalKitForm = () => {
  const { apiData, setApiData } = useApi();

  const [kitParts, setKitParts] = useState({});
  const [note, setNote] = useState('');
  const [kitSetTires, setKitSetTires] = useState([]);
  const [validations, setValidations] = useState({
    validHelmet: false,
    validOverall: false,
    validTechnic: false,
    validGloves: false,
    validShoes: false,
    validBodyProtection: false,
    validPublicity: false,
  });

  useEffect(() => {
    if (apiData) {
      setKitParts(apiData.kitParts || {});
      setNote(apiData.note || '');
      setKitSetTires(apiData.kitSetTires || []);
      setValidations({
        validHelmet: apiData.validHelmet || false,
        validOverall: apiData.validOverall || false,
        validTechnic: apiData.validTechnic || false,
        validGloves: apiData.validGloves || false,
        validShoes: apiData.validShoes || false,
        validBodyProtection: apiData.validBodyProtection || false,
        validPublicity: apiData.validPublicity || false,
      });
    }
  }, [apiData]);

  const handleKitPartChange = (type, index, value) => {
    setKitParts((prev) => ({
      ...prev,
      [type]: prev[type].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addKitPart = (type) => {
    setKitParts((prev) => ({
      ...prev,
      [type]: [...(prev[type] || []), ''],
    }));
  };

  const removeKitPart = (type, index) => {
    setKitParts((prev) => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index),
    }));
  };

  const handleSelectAll = () => {
    const allSelected = Object.values(validations).every(Boolean);
    const newState = Object.keys(validations).reduce((acc, key) => {
      acc[key] = !allSelected;
      return acc;
    }, {});
    setValidations(newState);
  };

  const handleValidationChange = (field) => {
    setValidations((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = () => {
    const payload = {
      ...validations,
      note,
      engineSeal: kitParts.engineSeal,
      engine: kitParts.engine,
      carburatorSeal: kitParts.carburatorSeal,
      carburator: kitParts.carburator,
      chassisSeal: kitParts.chassisSeal,
      chassis: kitParts.chassis,
      exhaustSeal: kitParts.exhaustSeal,
      exhaust: kitParts.exhaust,
      kitSetTires,
    };
    console.log('JSON to be sent:', JSON.stringify(payload, null, 2));
  };

  const addTireSet = () => {
    setKitSetTires((prev) => [...prev, ['', '', '', '']]);
  };

  const removeTireSet = (index) => {
    setKitSetTires((prev) => prev.filter((_, i) => i !== index));
  };

  const partPairs = [
    ['engineSeal', 'engine'],
    ['carburatorSeal', 'carburator'],
    ['chassisSeal', 'chassis'],
    ['exhaustSeal', 'exhaust'],
  ];

  const tirePositions = ['Front Left', 'Front Right', 'Rear Left', 'Rear Right'];

  return (
    <div className='kit-form'>
      <h2>Personal Kit Form</h2>

      <div className='kit-grid'>
        {partPairs.map(([seal, part]) => (
          <div className='kit-row' key={seal}>
            <div className='kit-item'>
              <label>{seal}:</label>
              {kitParts[seal]?.map((value, index) => (
                <div key={index} className='kit-input'>
                  <input
                    type='text'
                    value={value}
                    onChange={(e) => handleKitPartChange(seal, index, e.target.value)}
                  />
                  <button type='button' onClick={() => removeKitPart(seal, index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type='button' onClick={() => addKitPart(seal)}>
                Add {seal}
              </button>
            </div>
            <div className='kit-item'>
              <label>{part}:</label>
              {kitParts[part]?.map((value, index) => (
                <div key={index} className='kit-input'>
                  <input
                    type='text'
                    value={value}
                    onChange={(e) => handleKitPartChange(part, index, e.target.value)}
                  />
                  <button type='button' onClick={() => removeKitPart(part, index)}>
                    Remove
                  </button>
                </div>
              ))}
              <button type='button' onClick={() => addKitPart(part)}>
                Add {part}
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3>Note</h3>
      <div>
        <textarea
          className='note'
          type='text'
          value={note}
          onChange={(e) => {
            setNote(e.target.value);
          }}
        />
      </div>

      <h3>Kit Set Tires</h3>
      <div className='tires-container'>
        {kitSetTires.map((set, setIndex) => (
          <div className='tire-set' key={setIndex}>
            {set.map((tire, tireIndex) => (
              <div key={tireIndex} className='tire'>
                <span>{tirePositions[tireIndex] || 'Unknown'}</span>
                <input
                  key={tireIndex}
                  type='text'
                  value={tire}
                  onChange={(e) => {
                    const newTires = [...kitSetTires];
                    newTires[setIndex][tireIndex] = e.target.value;
                    setKitSetTires(newTires);
                  }}
                />
              </div>
            ))}
            <button type='button' onClick={() => removeTireSet(setIndex)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <button type='button' onClick={addTireSet}>
        Add Tire Set
      </button>

      <h3>Validation Items</h3>
      <div className='validation-items'>
        {Object.keys(validations).map((key) => (
          <label key={key} className='checkbox-label'>
            <input
              type='checkbox'
              checked={validations[key]}
              onChange={() => handleValidationChange(key)}
            />
            {key}
          </label>
        ))}
      </div>
      <button type='button' onClick={handleSelectAll}>
        Select All
      </button>

      <button type='button' className='submit-btn' onClick={handleSubmit}>
        Log JSON
      </button>
    </div>
  );
};

export default PersonalKitForm;
