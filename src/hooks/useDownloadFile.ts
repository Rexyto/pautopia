import { useState } from 'react';

export function useDownloadFile() {
  const [showUnavailable, setShowUnavailable] = useState(false);

  const downloadFile = (fileUrl: string) => {
    fetch(fileUrl, { method: 'HEAD', cache: 'no-cache' })
      .then((response) => {
        const contentType = response.headers.get('content-type');

        if (response.ok && contentType && contentType.includes('application/pdf')) {
          const link = document.createElement('a');
          link.href = fileUrl;
          link.download = '';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } else {
          setShowUnavailable(true);
        }
      })
      .catch(() => {
        setShowUnavailable(true);
      });
  };

  return { downloadFile, showUnavailable, setShowUnavailable };
}
