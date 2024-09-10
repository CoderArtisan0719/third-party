import type { Id } from '../../convex/_generated/dataModel';

export const defaultRequest = {
  userId: '' as Id<'users'>,
  kind: 'Surveys',
  survey: 'Boundary Survey',
  asset: 'Commercial - Multifamily',
  ALTAoptions: ['Standard ALTA Endorsement'],
  propertyAddress: '1600 Amphitheatre Parkway, Mountain View, CA',
  countyAccountInfo: '',
  siteContactInfoName: '',
  siteContactInfoPhone: '',
  siteContactInfoEmail: '',
  turnaroundTime: 'As soon as possible, or',
  specificDate: '',
  additionalInfo: [],
  otherSurvey: '',
  uploadCommits: [],
  uploadSurveys: [],
  uploadOthers: [],
  receivedBids: [],
  receivedUsers: [],
  status: 'open',
  requestUser: {
    fullname: '',
    email: '',
    creationTime: 0,
  },
};
