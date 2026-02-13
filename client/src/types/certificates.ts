
export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  background_color: string;
  text_color: string;
  logo_url?: string;
  border_style: 'none' | 'simple' | 'elegant' | 'modern';
  elements: CertificateElement[];
  created_at: string;
  updated_at: string;
}

export interface CertificateElement {
  id: string;
  type: 'text' | 'image' | 'signature' | 'date' | 'qr-code';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  font_size?: number;
  font_weight?: 'normal' | 'bold';
  align?: 'left' | 'center' | 'right';
  color?: string;
}

export interface Certificate {
  id: string;
  template_id: string;
  recipient_name: string;
  course_name: string;
  completion_date: string;
  issued_by: string;
  certificate_url: string;
  verification_code: string;
  created_at: string;
}

export interface CertificateAnalytics {
  total_issued: number;
  issued_this_month: number;
  most_popular_course: string;
  templates_used: number;
  download_count: number;
}
