import { useEffect, useState } from 'react';

import Uploader from '@/components/common/Uploader';
import type { InfoType } from '@/utils/types';

type UploaderProps = {
  additionalInfo: InfoType[];
  uploadCommits: string[];
  uploadSurveys: string[];
  uploadOthers: string[];
  requestSetter: (item: string, value: any) => void;
  loading1: boolean;
  setLoading1: (loading: boolean) => void;
  loading2: boolean;
  setLoading2: (loading: boolean) => void;
  loading3: boolean;
  setLoading3: (loading: boolean) => void;
};

const Upload = (props: UploaderProps) => {
  const [infos, setInfos] = useState<InfoType[]>(props.additionalInfo);

  const handleChange = (
    index: number,
    field: 'key' | 'value',
    newValue: string,
  ) => {
    setInfos((prevInfos) =>
      prevInfos.map((info) =>
        info.index === index ? { ...info, [field]: newValue } : info,
      ),
    );
  };

  const toggleEdit = (index: number, isEdit: boolean) => {
    setInfos((prevInfos) =>
      prevInfos.map((info) =>
        info.index === index ? { ...info, isEdit } : info,
      ),
    );
  };

  const remove = (index: number) => {
    setInfos((prevInfos) => prevInfos.filter((info) => info.index !== index));
  };

  useEffect(() => {
    props.requestSetter('additionalInfo', infos);
  }, [infos]);

  return (
    <div className="w-3/4">
      <p className="text-start text-lg">Please insert additional information</p>

      {infos.map((info) => {
        return info.isEdit ? (
          <div key={info.index} className="mt-2 grid grid-cols-7 gap-4">
            <input
              type="text"
              id={`upload_key_${info.index}`}
              placeholder="new data label"
              className="rounded border border-primary-deepBlue p-2"
              value={info.key}
              onChange={(e) => handleChange(info.index, 'key', e.target.value)}
            />

            <input
              type="text"
              id={`upload_value_${info.index}`}
              placeholder="new data value"
              className="col-span-4 rounded border border-primary-deepBlue p-2"
              value={info.value}
              onChange={(e) =>
                handleChange(info.index, 'value', e.target.value)
              }
            />

            <button
              onClick={() => {
                if (info.key === '' || info.value === '') return;
                toggleEdit(info.index, false);
              }}
              className="col-span-2 w-full rounded border border-primary-deepBlue p-2"
            >
              OK
            </button>
          </div>
        ) : (
          <div key={info.index} className="mt-2 grid grid-cols-7 gap-4">
            <div className="p-2 text-end">{info.key} : </div>

            <div className="col-span-4 p-2 text-start">{info.value}</div>

            <button
              onClick={() => toggleEdit(info.index, true)}
              className="w-full rounded border border-primary-deepBlue p-2"
            >
              Edit
            </button>

            <button
              onClick={() => remove(info.index)}
              className="w-full rounded border border-primary-deepBlue p-2"
            >
              Remove
            </button>
          </div>
        );
      })}

      <button
        onClick={() =>
          setInfos((prev) => [
            ...prev,
            { index: infos.length, key: '', value: '', isEdit: true },
          ])
        }
        className="mt-4 w-full rounded border border-primary-deepBlue p-2"
      >
        +
      </button>

      <Uploader
        title="Please upload any existing title commitments you have."
        uploadKey="uploadCommits"
        uploads={props.uploadCommits}
        requestSetter={props.requestSetter}
        loading={props.loading1}
        setLoading={props.setLoading1}
      />

      <Uploader
        title="Please upload any existing surveys you have."
        uploadKey="uploadSurveys"
        uploads={props.uploadSurveys}
        requestSetter={props.requestSetter}
        loading={props.loading2}
        setLoading={props.setLoading2}
      />

      <Uploader
        title="Please upload any other documents you may have."
        uploadKey="uploadOthers"
        uploads={props.uploadOthers}
        requestSetter={props.requestSetter}
        loading={props.loading3}
        setLoading={props.setLoading3}
      />
    </div>
  );
};

export default Upload;
