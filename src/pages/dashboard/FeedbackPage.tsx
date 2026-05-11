import React, { useEffect, useState } from "react";
import { useFeedbackStore } from "../../stores/useFeedbackStore";
import { useAuthStore } from "../../stores/useAuthStore";
import { MessageSquare, Star, User, Mail, Calendar, Package, AlertCircle } from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import BrandLoader from "../../components/ui/BrandLoader";

const FeedbackPage: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const { feedback, totalFeedback, isLoading, error, fetchFeedback, clearMessages } = useFeedbackStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [filterRating, setFilterRating] = useState<number | "all">("all");
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    fetchFeedback(currentPage, ITEMS_PER_PAGE);
  }, [currentPage, fetchFeedback]);

  // Auto-clear error messages
  useEffect(() => {
    if (error) {
      const t = setTimeout(clearMessages, 5000);
      return () => clearTimeout(t);
    }
  }, [error, clearMessages]);

  const filteredFeedback = filterRating === "all" 
    ? feedback 
    : feedback.filter((f) => f.rating === filterRating);

  const totalPages = Math.ceil(totalFeedback / ITEMS_PER_PAGE);
  const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1;
  const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalFeedback);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={i < rating ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    const colors = {
      pending: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
      reviewed: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      resolved: "bg-green-500/10 text-green-400 border-green-500/30",
    };
    return (
      <span className={`px-2 py-1 rounded text-xs border ${colors[status as keyof typeof colors] || colors.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (!user) {
    return (
      <div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400">
          <AlertCircle className="inline mr-2" size={18} />
          Unable to load feedback. Please login again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle size={18} />
            {error}
          </div>
          <button onClick={clearMessages} className="text-xl font-bold hover:opacity-70">×</button>
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="User Feedback"
        subtitle="View and manage feedback submitted by users"
        action={<MessageSquare size={28} className="text-brand-400 hidden sm:block" />}
      />

      {/* Filter Bar */}
      <div className="bg-surface-800 border border-surface-700 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <label className="text-sm text-slate-400 font-medium">Filter by Rating:</label>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value === "all" ? "all" : Number(e.target.value))}
            className="w-full sm:w-auto px-4 py-2 bg-surface-900 border border-surface-700 rounded-lg text-white focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/20"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <BrandLoader size="md" />
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredFeedback.length === 0 && (
        <div className="bg-surface-800 border border-surface-700 rounded-lg p-12 text-center">
          <MessageSquare size={48} className="mx-auto text-slate-600 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No Feedback Yet</h3>
          <p className="text-slate-400">
            {filterRating === "all" 
              ? "There is no feedback to display at the moment."
              : `No feedback with ${filterRating} star${filterRating === 1 ? '' : 's'} found.`}
          </p>
        </div>
      )}

      {/* Feedback Table */}
      {!isLoading && filteredFeedback.length > 0 && (
        <div className="bg-surface-800 border border-surface-700 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-surface-900 border-b border-surface-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="hidden sm:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="hidden md:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="hidden lg:table-cell px-4 sm:px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-700">
                {filteredFeedback.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-700/50 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium">
                          <User size={14} className="text-slate-500" />
                          {item.userName}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <Mail size={12} className="text-slate-500" />
                          {item.userEmail}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-white font-medium max-w-xs truncate">
                        {item.subject}
                      </div>
                      {item.category && (
                        <div className="text-xs text-slate-400 mt-1">
                          {item.category}
                        </div>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-1">
                        {renderStars(item.rating)}
                      </div>
                    </td>
                    <td className="hidden sm:table-cell px-4 sm:px-6 py-4">
                      {item.productName ? (
                        <div className="flex items-center gap-2 text-slate-300">
                          <Package size={14} className="text-slate-500" />
                          {item.productName}
                        </div>
                      ) : (
                        <span className="text-slate-500 text-sm">N/A</span>
                      )}
                    </td>
                    <td className="hidden md:table-cell px-4 sm:px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="hidden lg:table-cell px-4 sm:px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Calendar size={14} className="text-slate-500" />
                        {formatDate(item.createdAt)}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-slate-300 max-w-md line-clamp-2">
                        {item.message}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-surface-900 px-4 sm:px-6 py-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-surface-700">
              <div className="text-sm text-slate-400">
                Showing {startItem} to {endItem} of {totalFeedback} feedback
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-700 transition-colors"
                >
                  Previous
                </button>
                <span className="text-white font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-4 py-2 bg-surface-800 border border-surface-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FeedbackPage;
