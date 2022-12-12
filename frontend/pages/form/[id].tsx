import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import { GetForm, RoleEnum } from '../../components/api-types';
import { getName } from '../../components/utils';

const Form: NextPage = () => {
  // get id from router
  const { query } = useRouter();

  const result = useQuery<GetForm>('form-' + query.id, async () => {
    if (query.id) {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + '/form/' + query.id,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + localStorage.getItem('token'),
          },
        },
      );

      if (!response.ok) {
        throw new Error('Failed to fetch');
      }

      return await response.json();
    }
  });
  const form = result?.data?.form;
  const formData = result?.data?.formData;
  console.log({ formData });

  return (
    <>
      {result.isSuccess && result.data && form && (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="py-6">
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
                  </tr>
                </thead>
                <tbody>
                  {result.data && (
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
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              <h1 className="text-2xl font-bold mt-10">MoD</h1>

              {formData && (
                <>
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3 px-6"></th>
                        <th scope="col" className="py-3 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(formData).map((e) => {
                        if (e !== 'otherFields')
                          return (
                            <>
                              <tr className="bg-white border-b">
                                <th
                                  scope="row"
                                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap "
                                >
                                  {getName(e)}
                                </th>
                                <td className="py-4 px-6">
                                  {(formData as any)[e]}
                                </td>
                              </tr>
                            </>
                          );
                      })}
                      {formData?.otherFields &&
                        Object.keys(formData.otherFields).map((e) => {
                          return (
                            <>
                              <tr className="bg-white border-b">
                                <th
                                  scope="row"
                                  className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap "
                                >
                                  {getName(e)} (Other)
                                </th>
                                <td className="py-4 px-6">
                                  {(formData.otherFields as any)[e]}
                                </td>
                              </tr>
                            </>
                          );
                        })}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>
          {/* <div className="text-bold text-2xl"></div> */}
        </>
      )}
    </>
  );
};

export default Form;
