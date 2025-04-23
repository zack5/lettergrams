import { ReactNode } from 'react';

export default function DocumentPage({children} : {children?: ReactNode}) {
  return (
    <div className="document-page-container">
      <div className="document-page-contents">
        {children}
      </div>
    </div>
  );
}