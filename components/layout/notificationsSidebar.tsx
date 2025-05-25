import { useState, useEffect } from 'react'
import {X, AlertCircle, CheckCircle, Info, AlertTriangle, Trash2, Mail, MailOpen, Bell} from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock notifications data
const mockNotifications = [
    {
        id: 1,
        type: 'security',
        title: 'Security Alert',
        message: 'Unusual login attempt detected from new device in New York. Please verify if this was you.',
        time: '2 minutes ago',
        unread: true,
        icon: AlertTriangle,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-50 dark:bg-yellow-950/20'
    },
    {
        id: 2,
        type: 'system',
        title: 'System Update',
        message: 'NeoMetropolis CSRS v2.1.0 is now available with enhanced security features.',
        time: '1 hour ago',
        unread: true,
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
        id: 3,
        type: 'success',
        title: 'Data Sync Complete',
        message: 'All citizen records have been successfully synchronized with the central database.',
        time: '3 hours ago',
        unread: false,
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-950/20'
    },
    {
        id: 4,
        type: 'alert',
        title: 'Critical Alert',
        message: 'Database backup failed at 14:30. Immediate attention required to prevent data loss.',
        time: '5 hours ago',
        unread: false,
        icon: AlertCircle,
        color: 'text-red-500',
        bgColor: 'bg-red-50 dark:bg-red-950/20'
    },
    {
        id: 5,
        type: 'info',
        title: 'Maintenance Schedule',
        message: 'Scheduled maintenance window: Tomorrow 02:00 - 04:00 UTC. Services may be temporarily unavailable.',
        time: '1 day ago',
        unread: false,
        icon: Info,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50 dark:bg-blue-950/20'
    },
    {
        id: 6,
        type: 'security',
        title: 'Password Changed',
        message: 'Your account password was successfully changed from a trusted device.',
        time: '2 days ago',
        unread: false,
        icon: CheckCircle,
        color: 'text-green-500',
        bgColor: 'bg-green-50 dark:bg-green-950/20'
    }
]

export function NotificationsSidebar({ isOpen, onClose } : {isOpen: any, onClose : any} ) {
    const [notifications, setNotifications] = useState(mockNotifications)

    const unreadCount = notifications.filter(n => n.unread).length

    const markAsRead = (id : any) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, unread: false }
                    : notification
            )
        )
    }

    const markAsUnread = (id : any) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, unread: true }
                    : notification
            )
        )
    }

    const deleteNotification = (id : any) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id))
    }

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, unread: false }))
        )
    }

    const clearAll = () => {
        setNotifications([])
    }

    // Close sidebar when clicking outside on mobile
    useEffect(() => {
        const handleClickOutside = (event : any) => {
            if (isOpen && !event.target.closest('.notifications-sidebar')) {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('click', handleClickOutside)
            document.body.style.overflow = 'hidden' // Prevent background scroll on mobile
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={`
        notifications-sidebar fixed top-0 right-0 h-full w-full sm:w-96 lg:w-80 xl:w-96
        bg-background border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out z-50 flex flex-col
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                {/* Header */}
                <div className="flex-shrink-0 bg-background border-b border-border p-4">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-lg font-semibold">Notifications</h2>
                            {unreadCount > 0 && (
                                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onClose}
                            className="h-8 w-8"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Action buttons */}
                    {notifications.length > 0 && (
                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={markAllAsRead}
                                    className="text-xs"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={clearAll}
                                className="text-xs text-destructive hover:text-destructive"
                            >
                                Clear all
                            </Button>
                        </div>
                    )}
                </div>

                {/* Notifications list */}
                <div className="flex-1 overflow-y-auto min-h-0">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-muted-foreground px-4">
                            <Bell className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg font-medium">No notifications</p>
                            <p className="text-sm">You are all caught up!</p>
                        </div>
                    ) : (
                        <div className="p-4 space-y-3">
                            {notifications.map((notification) => {
                                const IconComponent = notification.icon
                                return (
                                    <div
                                        key={notification.id}
                                        className={`
                      group relative p-4 rounded-lg border transition-all duration-200 cursor-pointer
                      ${notification.unread
                                            ? `${notification.bgColor} border-l-4 border-l-primary`
                                            : 'bg-muted/30 hover:bg-muted/50'
                                        }
                    `}
                                        onClick={() => notification.unread && markAsRead(notification.id)}
                                    >
                                        {/* Unread indicator */}
                                        {notification.unread && (
                                            <div className="absolute top-4 left-2 w-2 h-2 bg-primary rounded-full" />
                                        )}

                                        <div className="flex gap-3">
                                            <div className={`flex-shrink-0 ${notification.color}`}>
                                                <IconComponent className="h-5 w-5" />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-1">
                                                    <h3 className="font-medium text-sm truncate">
                                                        {notification.title}
                                                    </h3>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 hover:bg-muted"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                notification.unread
                                                                    ? markAsRead(notification.id)
                                                                    : markAsUnread(notification.id)
                                                            }}
                                                        >
                                                            {notification.unread ? (
                                                                <MailOpen className="h-3 w-3" />
                                                            ) : (
                                                                <Mail className="h-3 w-3" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-6 w-6 hover:bg-destructive/20 hover:text-destructive"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                deleteNotification(notification.id)
                                                            }}
                                                        >
                                                            <Trash2 className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                                                    {notification.message}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}