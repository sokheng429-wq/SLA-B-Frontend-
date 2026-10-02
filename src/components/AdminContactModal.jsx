import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  X, 
  Mail, 
  Phone, 
  Clock, 
  Copy, 
  Check, 
  ExternalLink,
  Building2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AdminContactModal({ isOpen, onClose, onShowToast, defaultUsername = '' }) {
  const { t } = useApp();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const adminEmail = 'admin.support@bgroceries.com';
  const adminPhone = '+855 70 999 468';
  const adminHours = t('supportHoursValue');
  const adminDept = t('departmentValue');

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(adminEmail).then(() => {
      setCopiedEmail(true);
      if (onShowToast) {
        onShowToast('Admin email copied to clipboard!', 'success');
      }
      setTimeout(() => setCopiedEmail(false), 2500);
    }).catch(() => {
      if (onShowToast) {
        onShowToast('Failed to copy. Please copy manually.', 'warning');
      }
    });
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(adminPhone).then(() => {
      setCopiedPhone(true);
      if (onShowToast) {
        onShowToast('Phone number copied to clipboard!', 'success');
      }
      setTimeout(() => setCopiedPhone(false), 2500);
    }).catch(() => {
      if (onShowToast) {
        onShowToast('Failed to copy. Please copy manually.', 'warning');
      }
    });
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className="modal-container" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-badge-wrapper">
            <div className="modal-icon-badge">
              <ShieldAlert size={24} className="modal-icon-alert" />
            </div>
            <div>
              <span className="modal-tag">{t('accessRecovery')}</span>
              <h2 id="modal-title" className="modal-title">{t('contactAdminTitle')}</h2>
            </div>
          </div>
          <button 
            type="button" 
            className="modal-close-btn" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Description */}
        <div className="modal-notice">
          <p>{t('modalNotice')}</p>
        </div>

        {/* Admin Contact Cards */}
        <div className="contact-cards-grid">
          {/* Email Card */}
          <div className="contact-item">
            <div className="contact-item-icon">
              <Mail size={18} />
            </div>
            <div className="contact-item-content">
              <span className="contact-label">{t('adminEmailLabel')}</span>
              <span className="contact-value">{adminEmail}</span>
            </div>
            <div className="contact-actions">
              <button 
                type="button" 
                className={`contact-btn-copy ${copiedEmail ? 'copied' : ''}`}
                onClick={handleCopyEmail}
                title="Copy email to clipboard"
              >
                {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedEmail ? t('copied') : t('copy')}</span>
              </button>
              <a 
                href={`mailto:${adminEmail}?subject=Password%20Reset%20Request%20-%20SLA%20Portal&body=Hello%20IT%20Administration,%0D%0A%0D%0AI%20require%20assistance%20resetting%20my%20password%20for%20the%20SLA%20Portal.%0D%0A%0D%0AUsername:%20${encodeURIComponent(defaultUsername || '')}%0D%0AThank%20you.`}
                className="contact-btn-link"
                title="Open default email client"
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Hotline / Telegram Card */}
          <div className="contact-item">
            <div className="contact-item-icon">
              <Phone size={18} />
            </div>
            <div className="contact-item-content">
              <span className="contact-label">{t('adminPhoneLabel')}</span>
              <span className="contact-value">{adminPhone}</span>
            </div>
            <div className="contact-actions">
              <button 
                type="button" 
                className={`contact-btn-copy ${copiedPhone ? 'copied' : ''}`}
                onClick={handleCopyPhone}
                title="Copy phone / Telegram number"
              >
                {copiedPhone ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedPhone ? t('copied') : t('copy')}</span>
              </button>
              <a 
                href="https://t.me/+85570999468" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact-btn-link"
                title="Open IT Department in Telegram"
              >
                <ExternalLink size={14} />
              </a>
            </div>
            <span className="contact-badge-status">{t('internalLine')}</span>
          </div>

          {/* Department Card */}
          <div className="contact-item">
            <div className="contact-item-icon">
              <Building2 size={18} />
            </div>
            <div className="contact-item-content">
              <span className="contact-label">{t('departmentLabel')}</span>
              <span className="contact-value">{adminDept}</span>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="contact-item">
            <div className="contact-item-icon">
              <Clock size={18} />
            </div>
            <div className="contact-item-content">
              <span className="contact-label">{t('supportHoursLabel')}</span>
              <span className="contact-value">{adminHours}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button 
            type="button" 
            className="modal-btn-dismiss"
            onClick={onClose}
          >
            {t('close')}
          </button>
        </div>
      </div>
    </div>
  );
}
