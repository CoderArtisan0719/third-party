import { Input } from '@/components/ui/input';

type SiteContactInfoProps = {
  name: string;
  phone: string;
  email: string;
  requestSetter: (item: string, value: any) => void;
};

const SiteContactInfo = (props: SiteContactInfoProps) => {
  const fields = [
    { value: props.name, setter: 'siteContactInfoName', placeholder: 'name' },
    {
      value: props.phone,
      setter: 'siteContactInfoPhone',
      placeholder: 'phone',
    },
    {
      value: props.email,
      setter: 'siteContactInfoEmail',
      placeholder: 'email',
    },
  ];

  return (
    <div>
      {fields.map((field, index) => (
        <Input
          type="text"
          placeholder={field.placeholder}
          className="mt-4 w-96 rounded border border-gray-500 p-2"
          value={field.value}
          onChange={(e) => props.requestSetter(field.setter, e.target.value)}
          key={index}
        />
      ))}
    </div>
  );
};

export default SiteContactInfo;
