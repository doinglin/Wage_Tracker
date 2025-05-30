import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from './ThemeContext';

const AppContainer = styled.div<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  background-color: ${props => props.$isDark ? '#1a1a1a' : '#f5f5f5'};
  color: ${props => props.$isDark ? '#ffffff' : '#2c3e50'};
  transition: all 0.3s ease;
`;

const FormContainer = styled.div<{ $isDark: boolean }>`
  background: ${props => props.$isDark ? '#2d2d2d' : 'white'};
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.3s ease;
`;

const flipAnimation = keyframes`
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(180deg);
  }
  100% {
    transform: rotateY(360deg);
  }
`;

const CurrencyDisplay = styled.div<{ $isDark: boolean }>`
  font-size: 4.5rem;
  font-weight: bold;
  color: ${props => props.$isDark ? '#FFD700' : '#2c3e50'};
  margin: 2rem 0;
  padding: 3rem;
  background: ${props => props.$isDark ? '#2d2d2d' : 'white'};
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
  transition: all 0.3s ease;
  width: 80%;
  max-width: 600px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '🪙';
    position: absolute;
    left: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    animation: ${flipAnimation} 2s infinite linear;
  }

  &::after {
    content: '🪙';
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    animation: ${flipAnimation} 2s infinite linear;
  }
`;

const Button = styled.button<{ $isDark: boolean }>`
  background-color: ${props => props.$isDark ? '#3498db' : '#2980b9'};
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  margin: 0.5rem;
  transition: all 0.3s ease;

  &:hover {
    background-color: ${props => props.$isDark ? '#2980b9' : '#3498db'};
  }
`;

const Input = styled.input<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid ${props => props.$isDark ? '#444' : '#ddd'};
  border-radius: 5px;
  background-color: ${props => props.$isDark ? '#2d2d2d' : 'white'};
  color: ${props => props.$isDark ? '#ffffff' : '#2c3e50'};
  transition: all 0.3s ease;

  &::placeholder {
    color: ${props => props.$isDark ? '#888' : '#999'};
  }
`;

const Select = styled.select<{ $isDark: boolean }>`
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid ${props => props.$isDark ? '#444' : '#ddd'};
  border-radius: 5px;
  background-color: ${props => props.$isDark ? '#2d2d2d' : 'white'};
  color: ${props => props.$isDark ? '#ffffff' : '#2c3e50'};
  transition: all 0.3s ease;
`;

const ThemeToggle = styled(Button)`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
`;

const NavBar = styled.nav<{ $isDark: boolean }>`
  width: 100%;
  background: ${props => props.$isDark ? '#232323' : '#f5f5f5'};
  color: ${props => props.$isDark ? '#FFD700' : '#2c3e50'};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
`;

const NavButton = styled.button<{ $active: boolean; $isDark: boolean }>`
  background: none;
  border: none;
  color: ${props => props.$active ? (props.$isDark ? '#FFD700' : '#2980b9') : (props.$isDark ? '#fff' : '#2c3e50')};
  font-size: 1.1rem;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  margin: 0 1.5rem;
  cursor: pointer;
  border-bottom: 2px solid ${props => props.$active ? (props.$isDark ? '#FFD700' : '#2980b9') : 'transparent'};
  padding-bottom: 0.3rem;
  transition: color 0.2s, border-bottom 0.2s;
  outline: none;
`;

interface ResetRecord {
  time: string;
  earning: number;
}

const RESET_RECORDS_KEY = 'wageAppResetRecords';

interface ChangeHistoryEntry {
  timestamp: string;
  records: ResetRecord[];
  note?: string;
}

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const [wageType, setWageType] = useState<'hourly' | 'yearly'>('hourly');
  const [wage, setWage] = useState<number | ''>('');
  const [hoursPerWeek, setHoursPerWeek] = useState<number | ''>('');
  const [isRunning, setIsRunning] = useState(false);
  const [earnedAmount, setEarnedAmount] = useState(0);
  const [resetRecords, setResetRecords] = useState<ResetRecord[]>(() => {
    const saved = localStorage.getItem(RESET_RECORDS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [section, setSection] = useState<'home' | 'history'>('home');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [changeHistory, setChangeHistory] = useState<ChangeHistoryEntry[]>([]);
  const [editingNoteIdx, setEditingNoteIdx] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState('');
  const [undoState, setUndoState] = useState<{
    resetRecords: ResetRecord[];
    changeHistory: ChangeHistoryEntry[];
  } | null>(null);
  const [showUndo, setShowUndo] = useState(false);
  const undoTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Only show hoursPerWeek input if yearly is selected and wage is filled
  const showHoursPerWeek = wageType === 'yearly' && wage !== '';

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setEarnedAmount(prev => {
          let hourlyRate = 0;
          if (wageType === 'yearly' && wage !== '' && hoursPerWeek !== '') {
            hourlyRate = Number(wage) / (Number(hoursPerWeek) * 52);
          } else if (wageType === 'hourly' && wage !== '') {
            hourlyRate = Number(wage);
          }
          // Update every 100ms, so divide by 36000
          return prev + (hourlyRate / 36000);
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isRunning, wage, wageType, hoursPerWeek]);

  // Save resetRecords to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(RESET_RECORDS_KEY, JSON.stringify(resetRecords));
  }, [resetRecords]);

  // Add to change history whenever resetRecords changes (except on initial load)
  useEffect(() => {
    if (resetRecords.length > 0) {
      // Default note: Reset #<index> - Earned <amount> at reset
      const idx = resetRecords.length;
      const lastEarning = resetRecords[resetRecords.length - 1]?.earning || 0;
      const defaultNote = `Reset #${idx} - Earned ${formatCurrency(lastEarning)} at reset`;
      setChangeHistory(prev => [
        {
          timestamp: new Date().toLocaleString(),
          records: resetRecords,
          note: defaultNote,
        },
        ...prev,
      ]);
    }
    // eslint-disable-next-line
  }, [resetRecords]);

  const handleWageTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setWageType(e.target.value as 'hourly' | 'yearly');
    setEarnedAmount(0);
    setIsRunning(false);
    setWage('');
    setHoursPerWeek('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper to show undo popup
  const triggerUndo = (prevResetRecords: ResetRecord[], prevChangeHistory: ChangeHistoryEntry[]) => {
    setUndoState({ resetRecords: prevResetRecords, changeHistory: prevChangeHistory });
    setShowUndo(true);
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    undoTimeoutRef.current = setTimeout(() => setShowUndo(false), 5000);
  };

  // Modified handlers to support undo
  const handleDeleteSelected = () => {
    if (selectedRows.length === 0) return;
    const prevResetRecords = [...resetRecords];
    const prevChangeHistory = [...changeHistory];
    const newResetRecords = resetRecords.filter((_, idx) => !selectedRows.includes(idx));
    setResetRecords(newResetRecords);
    setSelectedRows([]);
    setChangeHistory(prev => [
      {
        timestamp: new Date().toLocaleString(),
        records: newResetRecords,
        note: 'Deletion',
      },
      ...prev,
    ]);
    triggerUndo(prevResetRecords, prevChangeHistory);
  };

  const handleReset = () => {
    const prevResetRecords = [...resetRecords];
    const prevChangeHistory = [...changeHistory];
    if (earnedAmount > 0) {
      setResetRecords(prev => [
        ...prev,
        {
          time: new Date().toLocaleString(),
          earning: earnedAmount,
        },
      ]);
    }
    setEarnedAmount(0);
    setIsRunning(false);
    triggerUndo(prevResetRecords, prevChangeHistory);
  };

  // Calculate the sum of all previous earnings
  const totalSum = resetRecords.reduce((sum, rec) => sum + rec.earning, 0);

  // Handle row selection
  const handleRowSelect = (idx: number) => {
    setSelectedRows(prev =>
      prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const handleRevert = (entry: ChangeHistoryEntry) => {
    const prevResetRecords = [...resetRecords];
    const prevChangeHistory = [...changeHistory];
    setResetRecords(entry.records);
    setSelectedRows([]);
    // Do NOT overwrite the note; keep the user's note as is
    triggerUndo(prevResetRecords, prevChangeHistory);
  };

  // Handle note editing
  const handleEditNote = (idx: number, currentNote: string) => {
    setEditingNoteIdx(idx);
    setNoteInput(currentNote);
  };
  const handleSaveNote = (idx: number) => {
    setChangeHistory(prev => prev.map((entry, i) => i === idx ? { ...entry, note: noteInput } : entry));
    setEditingNoteIdx(null);
    setNoteInput('');
  };
  const handleCancelNote = () => {
    setEditingNoteIdx(null);
    setNoteInput('');
  };

  // Handle delete all change history
  const handleDeleteChangeHistory = () => {
    const prevResetRecords = [...resetRecords];
    const prevChangeHistory = [...changeHistory];
    setChangeHistory([]);
    triggerUndo(prevResetRecords, prevChangeHistory);
  };

  // Undo handler
  const handleUndo = () => {
    if (undoTimeoutRef.current) clearTimeout(undoTimeoutRef.current);
    if (undoState) {
      setResetRecords(undoState.resetRecords);
      // Remove the most recent change history entry (the one being undone)
      setChangeHistory(undoState.changeHistory.slice(1));
    }
    setShowUndo(false);
    setUndoState(null);
  };

  // Download earning history as CSV
  const handleDownloadCSV = () => {
    if (resetRecords.length === 0) return;
    const header = ['#', 'Time', 'Earning'];
    const rows = resetRecords.map((rec, idx) => [
      idx + 1,
      rec.time,
      rec.earning
    ]);
    const csvContent = [header, ...rows]
      .map(row => row.map(String).map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'earning_history.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AppContainer $isDark={isDark}>
      <NavBar $isDark={isDark}>
        <NavButton $active={section === 'home'} $isDark={isDark} onClick={() => setSection('home')}>
          Home
        </NavButton>
        <NavButton $active={section === 'history'} $isDark={isDark} onClick={() => setSection('history')}>
          Earning History
        </NavButton>
      </NavBar>
      <ThemeToggle $isDark={isDark} onClick={toggleTheme}>
        {isDark ? '☀️ Light' : '🌙 Dark'}
      </ThemeToggle>

      {section === 'home' && (
        <>
          <FormContainer $isDark={isDark}>
            <h2>Wage Calculator</h2>
            <Select $isDark={isDark} value={wageType} onChange={handleWageTypeChange}>
              <option value="hourly">Hourly Wage</option>
              <option value="yearly">Yearly Salary</option>
            </Select>
            <Input
              $isDark={isDark}
              type="number"
              placeholder={wageType === 'hourly' ? 'Hourly Wage' : 'Yearly Salary'}
              value={wage}
              onChange={e => setWage(e.target.value === '' ? '' : Number(e.target.value))}
            />
            {showHoursPerWeek && (
              <Input
                $isDark={isDark}
                type="number"
                placeholder="Hours per week"
                value={hoursPerWeek}
                onChange={e => setHoursPerWeek(e.target.value === '' ? '' : Number(e.target.value))}
              />
            )}
          </FormContainer>

          <CurrencyDisplay $isDark={isDark}>
            {formatCurrency(earnedAmount)}
          </CurrencyDisplay>

          <div>
            <Button $isDark={isDark} onClick={() => setIsRunning(!isRunning)} disabled={wageType === 'yearly' ? (wage === '' || hoursPerWeek === '') : wage === ''}>
              {isRunning ? 'Stop' : 'Start'}
            </Button>
            <Button $isDark={isDark} onClick={handleReset}>
              Reset
            </Button>
          </div>
        </>
      )}

      {section === 'history' && resetRecords.length > 0 && (
        <div style={{ width: '80%', maxWidth: 600, margin: '2rem auto 0 auto' }}>
          <div style={{
            fontWeight: 'bold',
            fontSize: '1.3rem',
            marginBottom: '0.5rem',
            color: isDark ? '#FFD700' : '#2c3e50',
            textAlign: 'right',
          }}>
            Total Earned: {formatCurrency(totalSum)}
          </div>
          <div style={{ display: 'flex', gap: 10, marginBottom: '1rem' }}>
            <button
              style={{ background: '#16a085', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: 'pointer' }}
              onClick={handleDownloadCSV}
            >
              Download as CSV
            </button>
            <button
              style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, padding: '0.5rem 1rem', cursor: selectedRows.length ? 'pointer' : 'not-allowed', opacity: selectedRows.length ? 1 : 0.5 }}
              onClick={handleDeleteSelected}
              disabled={selectedRows.length === 0}
            >
              Delete Selected
            </button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: isDark ? '#232323' : '#fff', color: isDark ? '#fff' : '#222', borderRadius: 8, overflow: 'hidden' }}>
            <thead>
              <tr style={{ background: isDark ? '#333' : '#eee' }}>
                <th style={{ padding: '0.5rem' }}></th>
                <th style={{ padding: '0.5rem' }}>#</th>
                <th style={{ padding: '0.5rem' }}>Time</th>
                <th style={{ padding: '0.5rem' }}>Earning</th>
              </tr>
            </thead>
            <tbody>
              {resetRecords.map((rec, idx) => (
                <tr key={idx} style={{ borderTop: isDark ? '1px solid #444' : '1px solid #ddd' }}>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(idx)}
                      onChange={() => handleRowSelect(idx)}
                    />
                  </td>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>{idx + 1}</td>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>{rec.time}</td>
                  <td style={{ textAlign: 'center', padding: '0.5rem' }}>{formatCurrency(rec.earning)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Change history window */}
          {changeHistory.length > 0 && (
            <div style={{ marginTop: '2rem', background: isDark ? '#181818' : '#f9f9f9', borderRadius: 8, padding: '1rem', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
              <div style={{ fontWeight: 'bold', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Change History</span>
                <button style={{ background: '#c0392b', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.7rem', cursor: 'pointer' }} onClick={handleDeleteChangeHistory}>
                  Delete Change History
                </button>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, maxHeight: 150, overflowY: 'auto' }}>
                {changeHistory.map((entry, i) => (
                  <li key={i} style={{ marginBottom: 12, background: isDark ? '#232323' : '#fff', borderRadius: 4, padding: '0.7rem 0.9rem', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {/* First row: timestamp */}
                    <div style={{ fontWeight: 600, fontSize: '0.98rem', marginBottom: 2 }}>{entry.timestamp}</div>
                    {/* Second row: note (editable) */}
                    <div style={{ display: 'flex', alignItems: 'center', minHeight: 28 }}>
                      {editingNoteIdx === i ? (
                        <>
                          <input
                            style={{ padding: '0.2rem 0.4rem', borderRadius: 3, border: '1px solid #bbb', width: 180 }}
                            value={noteInput}
                            onChange={e => setNoteInput(e.target.value)}
                            autoFocus
                          />
                          <button style={{ marginLeft: 4, background: '#27ae60', color: '#fff', border: 'none', borderRadius: 3, padding: '0.2rem 0.5rem', cursor: 'pointer' }} onClick={() => handleSaveNote(i)}>
                            Save
                          </button>
                          <button style={{ marginLeft: 2, background: '#bbb', color: '#222', border: 'none', borderRadius: 3, padding: '0.2rem 0.5rem', cursor: 'pointer' }} onClick={handleCancelNote}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <span style={{ color: '#888', fontSize: '0.97rem' }}>{entry.note || <em>No note</em>}</span>
                        </>
                      )}
                    </div>
                    {/* Third row: buttons */}
                    <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                      {editingNoteIdx !== i && (
                        <button style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 3, padding: '0.2rem 0.7rem', cursor: 'pointer' }} onClick={() => handleEditNote(i, entry.note || '')}>
                          {entry.note ? 'Edit Note' : 'Add Note'}
                        </button>
                      )}
                      <button style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 4, padding: '0.2rem 0.7rem', cursor: 'pointer' }} onClick={() => handleRevert(entry)}>
                        Revert
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      {section === 'history' && resetRecords.length === 0 && (
        <div style={{ color: isDark ? '#fff' : '#222', textAlign: 'center', marginTop: '2rem' }}>
          No earning history yet.
        </div>
      )}
      {showUndo && (
        <div style={{
          position: 'fixed',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          background: isDark ? '#232323' : '#fff',
          color: isDark ? '#FFD700' : '#2c3e50',
          border: `1px solid ${isDark ? '#FFD700' : '#2c3e50'}`,
          borderRadius: 8,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          padding: '0.7rem 1.5rem',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 500,
        }}>
          <span>Action performed</span>
          <button style={{ background: '#2980b9', color: '#fff', border: 'none', borderRadius: 4, padding: '0.3rem 1rem', cursor: 'pointer', fontWeight: 600 }} onClick={handleUndo}>
            Undo
          </button>
        </div>
      )}
    </AppContainer>
  );
}

export default App; 