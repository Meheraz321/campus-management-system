import React, { useRef } from 'react';
import { User, Camera, Trash2, Upload } from 'lucide-react';

interface UserAvatarProps {
  src?: string | null;
  name?: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  editable?: boolean;
  onPhotoChange?: (photoUrl: string) => void;
  onPhotoRemove?: () => void;
}

export const getInitials = (name?: string): string => {
  if (!name || !name.trim()) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  name = 'User',
  role,
  size = 'md',
  className = '',
  editable = false,
  onPhotoChange,
  onPhotoRemove,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imgError, setImgError] = React.useState(false);

  // Reset imgError if src changes
  React.useEffect(() => {
    setImgError(false);
  }, [src]);

  // Filter out unwanted generic stock unsplash photos that were previously set as defaults
  const isGenericStockPhoto =
    src &&
    (src.includes('photo-1534528741775-53994a69daeb') ||
      src.includes('photo-1539571696357-5a69c17a67c6') ||
      src.includes('photo-1535713875002-d1d0cf377fde'));

  const hasCustomPhoto = src && src.trim().length > 0 && !imgError && !isGenericStockPhoto;

  const sizeClasses = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base',
    xl: 'h-20 w-20 text-xl',
    '2xl': 'h-24 w-24 sm:h-28 sm:w-28 text-2xl',
  }[size];

  const iconSizes = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-7 w-7',
    xl: 'h-10 w-10',
    '2xl': 'h-12 w-12',
  }[size];

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Verify it's an image
    if (!file.type.startsWith('image/')) {
      alert('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    // Limit to reasonable size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে। অনুগ্রহ করে ছোট ছবি নির্বাচন করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (onPhotoChange) {
        onPhotoChange(result);
      }
    };
    reader.readAsDataURL(file);
    // Reset input value so same file can be picked again if needed
    e.target.value = '';
  };

  const initials = getInitials(name);

  return (
    <div className={`relative inline-block shrink-0 select-none ${className}`}>
      {hasCustomPhoto ? (
        <img
          src={src!}
          alt={name}
          onError={() => setImgError(true)}
          className={`${sizeClasses} rounded-2xl object-cover shadow-md border-2 border-white/40 dark:border-slate-700 transition duration-200`}
        />
      ) : (
        <div
          className={`${sizeClasses} rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-800 text-white font-bold flex flex-col items-center justify-center shadow-md border-2 border-white/30 dark:border-indigo-500/30`}
          title={`${name} (No photo added yet)`}
        >
          {size === 'xs' || size === 'sm' ? (
            <span>{initials}</span>
          ) : size === 'md' ? (
            <div className="flex flex-col items-center justify-center">
              <span>{initials}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-0.5">
              <User className={iconSizes} />
              <span className="text-[11px] font-semibold tracking-wider opacity-90">{initials}</span>
            </div>
          )}
        </div>
      )}

      {/* Editable Overlay / Action */}
      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept="image/*"
            className="hidden"
          />
          <div className="absolute -bottom-1 -right-1 flex items-center gap-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-lg transition-transform duration-150 border-2 border-white dark:border-slate-900 cursor-pointer"
              title={hasCustomPhoto ? 'ছবি পরিবর্তন করুন (Change Photo)' : 'ছবি যোগ করুন (Add Photo)'}
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            {hasCustomPhoto && onPhotoRemove && (
              <button
                type="button"
                onClick={onPhotoRemove}
                className="p-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 active:scale-95 text-white shadow-lg transition-transform duration-150 border-2 border-white dark:border-slate-900 cursor-pointer"
                title="ছবি মুছে ফেলুন (Remove Photo)"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};
