"use client";

import { useState, useEffect } from "react";
import { MaterialIcon } from "@/components/ui/MaterialIcon";

interface Announcement {
  id: number;
  title: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Partial<Announcement>>({
    title: "",
    content: "",
    is_published: false,
  });

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/announcements");
      if (res.ok) {
        const data = await res.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async () => {
    try {
      const url = currentAnnouncement.id
        ? `/api/v1/announcements/${currentAnnouncement.id}`
        : "/api/v1/announcements";
      const method = currentAnnouncement.id ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "your_secure_internal_key", // TODO: better handling
        },
        body: JSON.stringify({
          title: currentAnnouncement.title,
          content: currentAnnouncement.content,
          is_published: currentAnnouncement.is_published,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        setCurrentAnnouncement({ title: "", content: "", is_published: false });
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Failed to save announcement:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this announcement?")) return;
    try {
      const res = await fetch(`/api/v1/announcements/${id}`, {
        method: "DELETE",
        headers: {
          "X-API-Key": "your_secure_internal_key",
        },
      });
      if (res.ok) {
        fetchAnnouncements();
      }
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text">Announcements</h1>
          <p className="text-text-muted text-sm mt-1">Manage system announcements and notifications</p>
        </div>
        <button
          onClick={() => {
            setCurrentAnnouncement({ title: "", content: "", is_published: false });
            setIsEditing(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <MaterialIcon name="add" className="!text-lg" />
          <span>New Announcement</span>
        </button>
      </div>

      {isEditing && (
        <div className="bg-surface border border-border-ghost/10 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-text mb-4">
            {currentAnnouncement.id ? "Edit Announcement" : "Create Announcement"}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Title</label>
              <input
                type="text"
                value={currentAnnouncement.title}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, title: e.target.value })}
                className="w-full bg-surface-lowest border border-border-ghost/10 rounded-lg px-4 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Announcement Title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1">Content</label>
              <textarea
                value={currentAnnouncement.content}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, content: e.target.value })}
                className="w-full bg-surface-lowest border border-border-ghost/10 rounded-lg px-4 py-2 text-text min-h-[120px] focus:outline-none focus:ring-2 focus:ring-primary/20"
                placeholder="Announcement details..."
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_published"
                checked={currentAnnouncement.is_published}
                onChange={(e) => setCurrentAnnouncement({ ...currentAnnouncement, is_published: e.target.checked })}
                className="rounded border-border-ghost/10 text-primary focus:ring-primary"
              />
              <label htmlFor="is_published" className="text-sm font-medium text-text">
                Publish immediately
              </label>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 text-text hover:bg-surface-high rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!currentAnnouncement.title || !currentAnnouncement.content}
                className="px-4 py-2 bg-primary text-primary-content rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                Save Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-surface border border-border-ghost/10 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-text-muted">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="p-8 text-center text-text-muted">No announcements found.</div>
        ) : (
          <div className="divide-y divide-border-ghost/5">
            {announcements.map((announcement) => (
              <div key={announcement.id} className="p-6 hover:bg-surface-high/50 transition-colors flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-text">{announcement.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        announcement.is_published
                          ? "bg-green-500/10 text-green-500"
                          : "bg-surface-highest text-text-muted"
                      }`}
                    >
                      {announcement.is_published ? "Published" : "Draft"}
                    </span>
                  </div>
                  <p className="text-sm text-text-muted line-clamp-2">{announcement.content}</p>
                  <div className="text-xs text-text-muted/60 mt-3">
                    Created: {new Date(announcement.created_at).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setCurrentAnnouncement(announcement);
                      setIsEditing(true);
                    }}
                    className="p-2 text-text-muted hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                    aria-label="Edit announcement"
                  >
                    <MaterialIcon name="edit" className="!text-xl" />
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="p-2 text-text-muted hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    aria-label="Delete announcement"
                  >
                    <MaterialIcon name="delete" className="!text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
