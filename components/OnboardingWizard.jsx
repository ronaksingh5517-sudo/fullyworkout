"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function StepOnboarding() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ name: '', age: '', weight: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (formData.name.trim().length < 3) {
        setError('Name must be at least 3 characters long.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!formData.age || Number(formData.age) <= 0 || Number(formData.age) > 65) {
        setError('Enter a valid age up to 65.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorRef: setError('');
    setLoading(true);

    try {
      // Backend par onboarding complete mark karne ke liye API call
      await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          email: session?.user?.email,
          onboardingCompleted: true
        })
      });
    } catch (err) {
      console.error("Onboarding sync error:", err);
    }

    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
      router.refresh();
    }, 600);
  };

  return (
    <div style={{ maxWidth: '400px', margin: '80px auto', padding: '30px', background: '#0b0f17', color: '#fff', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 20px 40px rgba(0,0,0,0.7)', fontFamily: 'system-ui, sans-serif' }}>
      <h2 style={{ fontSize: '22px', fontWeight: 800, textAlign: 'center', margin: '0 0 6px 0' }}>Complete Your Profile 🧬</h2>
      <p style={{ fontSize: '13px', color: '#94a3b8', textAlign: 'center', margin: '0 0 16px 0' }}>Step {step} of 3</p>

      {error && <p style={{ color: '#f87171', fontSize: '13.5px', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '14px' }}>{error}</p>}

      {step === 1 && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>What is your Name?</label>
          <input 
            type="text" 
            placeholder="Enter name"
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxSizing: 'border-box' }}
          />
          <button type="button" onClick={handleNext} style={{ width: '100%', marginTop: '20px', padding: '12px', background: '#7a45ff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>Next →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>What is your Age?</label>
          <input 
            type="number" 
            placeholder="Enter age"
            value={formData.age} 
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setStep(1)} style={{ width: '50%', padding: '12px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Back</button>
            <button type="button" onClick={handleNext} style={{ width: '50%', padding: '12px', background: '#7a45ff', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>Next →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <form onSubmit={handleSubmit}>
          <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: 700 }}>What is your Weight (kg)?</label>
          <input 
            type="number" 
            placeholder="Enter weight"
            value={formData.weight} 
            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#121622', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button type="button" onClick={() => setStep(2)} style={{ width: '50%', padding: '12px', background: 'rgba(255,255,255,0.08)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer' }}>Back</button>
            <button type="submit" disabled={loading} style={{ width: '50%', padding: '12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 800 }}>{loading ? "Saving..." : "Save & Open"}</button>
          </div>
        </form>
      )}
    </div>
  );
}