import React, { useState } from 'react';
import { Settings, Shield, Key, Sliders, CheckCircle2, Save, ExternalLink } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [agencyName, setAgencyName] = useState('1UpSites');
  const [tagline, setTagline] = useState('Boutique Website Design & Client Management');
  const [supportEmail, setSupportEmail] = useState('hello@1upsites.com');
  const [defaultRate, setDefaultRate] = useState('150');
  const [defaultSupportDays, setDefaultSupportDays] = useState('7');
  const [defaultRounds, setDefaultRounds] = useState('2');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      {/* Header */}
      <div className="pb-4 border-b border-[#E8E2D9]">
        <span className="text-xs uppercase tracking-widest text-[#B99A74] font-semibold block mb-1">
          Solo Agency Configuration
        </span>
        <h1 className="font-serif-heading text-2xl sm:text-3xl font-semibold text-[#171717]">
          Agency Settings
        </h1>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6 text-xs">
        
        {/* Business Profile */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <h3 className="font-serif-heading text-base font-semibold text-[#171717] flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#B99A74]" />
            1UpSites Business Profile
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Agency Name</label>
              <input
                type="text"
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-semibold focus:border-[#B99A74] focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-[#171717] mb-1">Tagline & Brand Positioning</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs focus:border-[#B99A74] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Default Revision & Commercial Policy */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <h3 className="font-serif-heading text-base font-semibold text-[#171717] flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#B99A74]" />
            Default Contract Preferences & Rates
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-[#171717] mb-1">Default Included Revision Rounds</label>
              <input
                type="number"
                value={defaultRounds}
                onChange={(e) => setDefaultRounds(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-mono focus:border-[#B99A74] focus:outline-none"
              />
              <span className="text-[10px] text-[#77736D] mt-1 block">Contractual default for new SOW proposals.</span>
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">Post-Launch Support Window (Days)</label>
              <input
                type="number"
                value={defaultSupportDays}
                onChange={(e) => setDefaultSupportDays(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-mono focus:border-[#B99A74] focus:outline-none"
              />
              <span className="text-[10px] text-[#77736D] mt-1 block">Included post-launch bug-fix window.</span>
            </div>

            <div>
              <label className="block font-semibold text-[#171717] mb-1">Out-of-Scope Hourly Rate ($/hr)</label>
              <input
                type="number"
                value={defaultRate}
                onChange={(e) => setDefaultRate(e.target.value)}
                className="w-full p-2.5 border border-[#E8E2D9] rounded-xl text-xs font-mono focus:border-[#B99A74] focus:outline-none"
              />
              <span className="text-[10px] text-[#77736D] mt-1 block">Applied to extra revisions beyond SOW scope.</span>
            </div>
          </div>
        </div>

        {/* Integration Statuses */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E2D9] shadow-2xs space-y-4">
          <h3 className="font-serif-heading text-base font-semibold text-[#171717] flex items-center gap-2">
            <Key className="w-4 h-4 text-[#B99A74]" />
            Integration Statuses & Production Gateways
          </h3>

          <div className="space-y-3">
            {[
              {
                name: 'Google AI Studio Integration',
                status: 'Active (Connected)',
                type: 'Live Prototype Frame',
                desc: 'Websites generated & hosted in Google AI Studio render via live published links.'
              },
              {
                name: 'Stripe Payment Gateway',
                status: 'Placeholder',
                type: 'Production Gateway',
                desc: 'Requires connecting production API keys for credit card processing.'
              },
              {
                name: 'DocuSign E-Signature Integration',
                status: 'Placeholder',
                type: 'Contract Signing',
                desc: 'Requires DocuSign OAuth credentials for automated PDF e-signatures.'
              },
              {
                name: 'Transactional Email Service (Resend/SendGrid)',
                status: 'Placeholder',
                type: 'Email Invitations',
                desc: 'Requires SMTP or API key connection for authenticated client portal invitation emails.'
              }
            ].map((integ, idx) => (
              <div key={idx} className="p-3.5 bg-[#FAF8F4] border border-[#E8E2D9] rounded-xl flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-[#171717] font-semibold">{integ.name}</strong>
                    <span className="text-[10px] text-neutral-500 font-mono">({integ.type})</span>
                  </div>
                  <p className="text-[11px] text-[#77736D]">{integ.desc}</p>
                </div>

                <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                  integ.status.includes('Active') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-200 text-neutral-700'
                }`}>
                  {integ.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="px-6 py-2.5 bg-[#171717] hover:bg-[#262626] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-xs"
          >
            <Save className="w-4 h-4 text-[#B99A74]" />
            Save Agency Settings
          </button>

          {savedSuccess && (
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> Settings updated successfully!
            </span>
          )}
        </div>

      </form>

    </div>
  );
};
