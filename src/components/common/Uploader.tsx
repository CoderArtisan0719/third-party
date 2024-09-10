import { useMutation } from 'convex/react';
import React, { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { api } from '../../../convex/_generated/api';

type UploaderProps = {
  title: string;
  uploadKey: string;
  uploads: string[];
  requestSetter: (item: string, value: any) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

const Uploader = (props: UploaderProps) => {
  const [file, setFile] = useState<File>();
  const [notification, setNotification] = useState('');

  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleUpload = useCallback(async () => {
    setNotification('');
    props.setLoading(true);

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: 'POST',
      headers: { 'Content-Type': file?.type ?? '' },
      body: file,
    });
    const { storageId } = await result.json();

    // Step 3: Save the newly allocated storage id
    props.requestSetter(props.uploadKey, [...props.uploads, storageId]);
    setNotification('Successfully uploaded!');
    props.setLoading(false);
  }, [file]);

  return (
    <div className="mt-8">
      <p className="py-2 text-start text-lg">{props.title}</p>

      <div className="flex gap-2">
        <Input
          type="file"
          className="cursor-pointer bg-white"
          onChange={(e) => setFile(e.target.files?.[0])}
          id="picture"
        />

        <Button
          className="bg-primary-azureBlue text-white"
          onClick={handleUpload}
          disabled={props.loading || file === undefined}
        >
          {props.loading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>

      {!props.loading && file !== undefined && (
        <p className="py-2 text-start text-green-600">{notification}</p>
      )}
    </div>
  );
};

export default Uploader;
