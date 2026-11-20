import type { EnquirySubmission } from '../types';
import { generateEnquiryReference } from './validation';

export type NewEnquirySubmission = Omit<
  EnquirySubmission,
  'id' | 'createdAt' | 'status'
>;

export function createEnquirySubmission(
  data: NewEnquirySubmission,
): EnquirySubmission {
  return {
    ...data,
    id: generateEnquiryReference(),
    createdAt: new Date().toISOString(),
    status: 'Pending',
  };
}
