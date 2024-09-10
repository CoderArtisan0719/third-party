/* eslint-disable no-param-reassign */
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

import type { RequestType } from '@/utils/types';

import type { Id } from '../../../convex/_generated/dataModel';

const initialState: RequestType = {
  userId: '' as Id<'users'>,
  kind: 'Surveys',
  survey: 'Boundary Survey',
  asset: 'Multifamily',
  assetOther: '',
  ALTAoptions: [],
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
    creationTime: 0,
    fullname: '',
    email: '',
  },
};

const requestSlice = createSlice({
  name: 'request',

  initialState,

  reducers: {
    setReq: (state, action: PayloadAction<RequestType>) => {
      state.kind = action.payload.kind;
      state.survey = action.payload.survey;
      state.ALTAoptions = action.payload.ALTAoptions;
      state.propertyAddress = action.payload.propertyAddress;
      state.countyAccountInfo = action.payload.countyAccountInfo;
      state.siteContactInfoName = action.payload.siteContactInfoName;
      state.siteContactInfoPhone = action.payload.siteContactInfoPhone;
      state.siteContactInfoEmail = action.payload.siteContactInfoEmail;
      state.turnaroundTime = action.payload.turnaroundTime;
      state.specificDate = action.payload.specificDate;
      state.additionalInfo = action.payload.additionalInfo;
      state.otherSurvey = action.payload.otherSurvey;
      state.uploadCommits = action.payload.uploadCommits;
      state.uploadSurveys = action.payload.uploadSurveys;
      state.uploadOthers = action.payload.uploadOthers;
      state.status = action.payload.status;
      state.receivedBids = action.payload.receivedBids;
      state.receivedUsers = action.payload.receivedUsers;
      state.requestUser = action.payload.requestUser;
    },
  },
});

export const { setReq } = requestSlice.actions;

export default requestSlice.reducer;
