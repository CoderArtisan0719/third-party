/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { useAuthToken } from '@convex-dev/auth/react';
import { useMutation } from 'convex/react';
import { jwtDecode } from 'jwt-decode';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';

import Meta from '@/components/common/Meta';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import Deposit from '@/components/payment/Deposit';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { UserTableType } from '@/utils/types';

import { api } from '../../../../convex/_generated/api';
import type { Id } from '../../../../convex/_generated/dataModel';

const Settings = () => {
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | undefined>();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [newReqFlag, setNewReqFlag] = useState(false);
  const [user, setUser] = useState<UserTableType>();
  const [success, setSuccess] = useState(false);
  const [isEqual, setIsEqual] = useState(true);
  const [invalidEmail, setInvalidEmail] = useState('');
  const [invalidPassword, setInvalidPassword] = useState('');
  const [criteria, setCriteria] = useState(false);
  const [successEmail, setSuccessEmail] = useState(' ');
  const [successPhoto, setSuccessPhoto] = useState(' ');
  const [successPassword, setSuccessPassword] = useState(' ');

  const emailRegex = /^[\w-+.]+@([\w-]+\.)+[\w-]{2,4}$/;
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

  const router = useRouter();
  const token = useAuthToken();

  const userMutation = useMutation(api.users.getById);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const changeProfileMutation = useMutation(api.settings.profile);
  const uploadPhotoMutation = useMutation(api.settings.photo);
  const changePasswordMutation = useMutation(api.settings.password);

  const handleChangeProfile = async () => {
    setSuccessEmail('');

    if (!emailRegex.test(email)) {
      setInvalidEmail('Email is an invalid one.');
      return;
    }

    changeProfileMutation({ fullname, email, userId: user!._id }).then(() => {
      setSuccess(true);
      setSuccessEmail('Successfully Changed.');
      setInvalidEmail('');
    });
  };

  const handleUploadPhoto = useCallback(async () => {
    setSuccessPhoto('');
    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': photo?.type ?? '' },
      body: photo,
    });
    const { storageId } = await result.json();

    // Step 3: Save the newly allocated photo id
    await uploadPhotoMutation({
      userId: user!._id as Id<'users'>,
      photo: storageId as Id<'_storage'>,
    });

    setSuccess(true);
    setSuccessPhoto('Successfully Uploaded.');
  }, [photo]);

  const handleChangePassword = async () => {
    setSuccessPassword('');

    if (isEqual) {
      if (!passwordRegex.test(newPassword)) {
        setInvalidPassword('Password is too weak.');
        setCriteria(true);
        return;
      }

      const res = await changePasswordMutation({
        userId: user!._id,
        newPassword,
        oldPassword,
      });

      console.log(res);

      setSuccessPassword('Successfully Changed.');
      setInvalidPassword('');
    }
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem('userInfo');

    if (!userInfo) router.push('/');
    else {
      const parsedUserInfo = JSON.parse(userInfo);
      setUser(parsedUserInfo);
      setEmail(parsedUserInfo.email);
      setFullname(parsedUserInfo.fullname);
    }
  }, []);

  useEffect(() => {
    if (success && token) {
      const userId = token
        ? jwtDecode(String(token))?.sub?.split('|')[0]
        : null;

      userMutation({ userId: userId as Id<'users'> }).then((res) => {
        sessionStorage.setItem('userInfo', JSON.stringify(res));
      });

      setSuccess(false);
    }
  }, [success, token]);

  return (
    <div className="grid gap-8 lg:grid-cols-4 xl:grid-cols-6">
      <Meta title="settings" />

      <DashboardSidebar success={success} className="bg-gray-100 px-4 pt-12" />

      <div className="overflow-auto px-8 pt-16 lg:col-span-3 lg:h-screen xl:col-span-5">
        <DashboardHeader
          title="Settings"
          newReqFlag={newReqFlag}
          setNewReqFlag={setNewReqFlag}
        />

        <Tabs defaultValue="account" className="mt-16 w-1/2">
          <TabsList className="ml-16 bg-slate-300">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="payment">Payment Method</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
            <div className="flex gap-4">
              <div className="flex w-64 flex-col items-center gap-4 pr-8 pt-8 text-xl font-semibold text-primary-azureBlue">
                <span>Deposit to My Account</span>
                <span className="text-black">${user?.balance}</span>
              </div>
              <Deposit user={user} setUser={setUser} />
            </div>
          </TabsContent>
          <TabsContent value="payment">
            <div className="flex gap-4">
              <p className="w-48 pr-8 pt-8 text-right text-xl font-semibold text-primary-azureBlue">
                Change Profile
              </p>
              <div className="grid flex-1 gap-4 pt-4 lg:w-1/2">
                <div>
                  <Label className="text-md">Full Name</Label>
                  <Input
                    placeholder="Full Name"
                    className="border border-slate-500"
                    onChange={(e) => setFullname(e.target.value)}
                    value={fullname}
                  />
                </div>

                <div>
                  <Label className="text-md">Email</Label>
                  <Input
                    placeholder="Email"
                    className="border border-slate-500"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                  />
                </div>

                <div>
                  <p className="text-sm text-green-500">{successEmail}</p>
                  <p className="text-sm text-red-500">{invalidEmail}</p>
                </div>

                <div>
                  <Button
                    className="w-36 bg-primary-azureBlue text-white"
                    onClick={handleChangeProfile}
                    disabled={!successEmail && !invalidEmail}
                  >
                    {successEmail || invalidEmail ? 'Change' : 'Please wait...'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <p className="w-48 pr-8 pt-8 text-right text-xl font-semibold text-primary-azureBlue">
                Change Photo
              </p>
              <div className="grid flex-1 gap-4 pt-4 lg:w-1/2">
                <div>
                  <Label className="text-md">Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder="Photo"
                    className="cursor-pointer border border-slate-500"
                    onChange={(e) => setPhoto(e.target.files?.[0])}
                  />
                </div>

                <div>
                  <p className="text-sm text-green-500">{successPhoto}</p>
                </div>

                <div>
                  <Button
                    className="w-36 bg-primary-azureBlue text-white"
                    onClick={handleUploadPhoto}
                    disabled={!successPhoto || !photo}
                  >
                    {successPhoto ? 'Upload' : 'Please wait...'}
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <p className="w-48 pr-8 pt-8 text-right text-xl font-semibold text-primary-azureBlue">
                Change Password
              </p>
              <div className="mb-32 grid flex-1 gap-4 pt-4 lg:w-1/2">
                <div>
                  <Label className="text-md">Current password</Label>
                  <Input
                    type="password"
                    placeholder="Current password"
                    className="border border-slate-500"
                    onChange={(e) => setOldPassword(e.target.value)}
                    value={oldPassword}
                  />
                </div>

                <div>
                  <Label className="text-md">New password</Label>
                  <Input
                    type="password"
                    placeholder="New password"
                    className="border border-slate-500"
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                  />
                </div>

                <div>
                  <Label className="text-md">Retype new password</Label>
                  <Input
                    type="password"
                    placeholder="Retype new password"
                    className="border border-slate-500"
                    onChange={(e) => {
                      setConfirm(e.target.value);
                      setIsEqual(newPassword === e.target.value);
                    }}
                    value={confirm}
                  />

                  {!isEqual && (
                    <p className="text-red-500">Password does not match.</p>
                  )}

                  <div className="mt-4">
                    <p className="text-sm text-green-500">{successPassword}</p>
                    <p className="text-sm text-red-500">{invalidPassword}</p>
                  </div>

                  {criteria && (
                    <div className="mb-4">
                      <p className="text-red-500">
                        Password must contains following.
                      </p>
                      <p className="text-slate-400">1 uppercase letter</p>
                      <p className="text-slate-400">1 lowercase letter</p>
                      <p className="text-slate-400">
                        1 number or special character
                      </p>
                      <p className="text-slate-400">8 characters long</p>
                    </div>
                  )}
                </div>

                <div>
                  <Button
                    className="w-36 bg-primary-azureBlue text-white"
                    onClick={handleChangePassword}
                    disabled={!successPassword && !invalidPassword}
                  >
                    {successPassword || invalidPassword
                      ? 'Change'
                      : 'Please wait...'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
