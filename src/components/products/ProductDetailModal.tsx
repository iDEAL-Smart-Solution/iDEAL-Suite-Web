import React from "react";
import type { Product } from "../../types/product";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunch: (productId: string) => void;
  onToggleStatus: (productId: string, currentStatus: boolean) => void;
  isAdmin: boolean;
  isLoading?: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onLaunch,
  onToggleStatus,
  isAdmin,
  isLoading = false,
}) => {
  if (!isOpen || !product) return null;

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "Never";
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-lg" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="flex-center-between">
            <h2 className="modal-title">{product.productName}</h2>
            <button className="btn-close" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Product Code */}
          <div className="detail-section">
            <label className="detail-label">Product Code</label>
            <p className="detail-value">{product.productCode}</p>
          </div>

          {/* Status */}
          <div className="detail-section">
            <label className="detail-label">Status</label>
            <p className="detail-value">
              <span
                className={`status-badge ${product.isActive ? "active" : "inactive"}`}
              >
                {product.isActive ? "🟢 Active" : "🔴 Inactive"}
              </span>
            </p>
          </div>

          {/* Description */}
          <div className="detail-section">
            <label className="detail-label">Description</label>
            <p className="detail-value">{product.description}</p>
          </div>

          {/* Subscription Requirement */}
          <div className="detail-section">
            <label className="detail-label">Subscription Requirement</label>
            <p className="detail-value">
              {product.requiresSubscription ? (
                <span className="badge badge-warning">Requires Active Subscription</span>
              ) : (
                <span className="badge badge-success">No Subscription Required</span>
              )}
            </p>
          </div>

          {/* Usage Statistics */}
          <div className="detail-section">
            <label className="detail-label">Usage Statistics</label>
            <div className="stats-grid">
              <div className="stat-box">
                <span className="stat-box-label">Total Usage</span>
                <span className="stat-box-value">{product.usageCount || 0}</span>
              </div>
              <div className="stat-box">
                <span className="stat-box-label">Last Used</span>
                <span className="stat-box-value">{formatDate(product.lastUsed)}</span>
              </div>
            </div>
          </div>

          {/* Created/Updated Info */}
          <div className="detail-section">
            <label className="detail-label">Timeline</label>
            <div className="timeline-grid">
              <div className="timeline-item">
                <span className="timeline-label">Active Since</span>
                <span className="timeline-value">
                  {formatDate(product.activeSince || null)}
                </span>
              </div>
              <div className="timeline-item">
                <span className="timeline-label">Last Used</span>
                <span className="timeline-value">
                  {formatDate(product.lastUsed || null)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              onLaunch(product.productId);
              onClose();
            }}
            disabled={!product.isActive || isLoading}
          >
            {isLoading ? "Launching..." : "Launch Product"}
          </button>
          {isAdmin && (
            <button
              className={`btn ${product.isActive ? "btn-danger" : "btn-success"}`}
              onClick={() => {
                onToggleStatus(product.productId, product.isActive);
                onClose();
              }}
              disabled={isLoading}
            >
              {product.isActive ? "Deactivate" : "Activate"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
