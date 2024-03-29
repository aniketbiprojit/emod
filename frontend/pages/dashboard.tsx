import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Form, RoleEnum } from '../components/api-types';

export default function Dashboard() {
  const result = useQuery<{ forms: Form[] }>('forms', async () => {
    const response = await fetch(process.env.NEXT_PUBLIC_API_URL + '/form', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
    });
    return await response.json();
  });

  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) push('/login');
  }, []);

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-auto relative">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="py-3 px-6">
                  Title
                </th>
                <th scope="col" className="py-3 px-6">
                  Started
                </th>
                <th scope="col" className="py-3 px-6">
                  Next Approval
                </th>
                <th scope="col" className="py-3 px-6">
                  Status
                </th>
                <th scope="col" className="py-3 px-6">
                  Created At
                </th>
                <th scope="col" className="py-3 px-6">
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {result.data &&
                result.data.forms.map((form) => (
                  <>
                    <tr className="bg-white border-b">
                      <th
                        scope="row"
                        className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap "
                      >
                        {form.name}
                      </th>
                      <td className="py-4 px-6">
                        {form.formState[0].from.email}
                      </td>
                      <td className="py-4 px-6">
                        {form.formState.at(-2)?.to?.email}
                      </td>
                      <td className="py-4 px-6">
                        {form.rejected === true
                          ? 'Rejected'
                          : form.formState.at(-1)?.from.role === RoleEnum.VC
                          ? 'Approved'
                          : 'Pending'}
                      </td>
                      <td className="py-4 px-6">
                        {new Date(form.createdAt).toLocaleString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="py-4 px-6">
                        <a
                          href={`/form/${form._id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </a>
                      </td>
                    </tr>
                  </>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
function axios(arg0: string): { data: any } | PromiseLike<{ data: any }> {
  throw new Error('Function not implemented.');
}
