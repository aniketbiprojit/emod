import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Form as FormType,
  GetForm,
  RoleEnum,
} from '../../components/api-types';
import { getName, parseJwt } from '../../components/utils';

type JWTPayload = {
  email: string;
  role: RoleEnum;
  _id: string;
};
const Form: NextPage = () => {
  // get id from router
  const { query } = useRouter();

  const [userData, setUserData] = useState<JWTPayload>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserData(parseJwt<JWTPayload>(token));
    }
  }, []);

  const formDataResult = useQuery<GetForm>('form-' + query.id, async () => {
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
  const form = formDataResult?.data?.form;
  const formData = formDataResult?.data?.formData;

  return (
    <>
      {formDataResult.isSuccess && formDataResult.data && form && (
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
                  {formDataResult.data && (
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
                          {getCurrentApproval(form)}
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

      {form &&
        form.rejected === false &&
        getCurrentApproval(form) === userData?.email && (
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="py-6">
              <h1 className="text-2xl font-bold mt-10">Update Status</h1>
              <button className="group my-2 relative flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none">
                Approve
              </button>
              <button className="group  relative flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none">
                Reject
              </button>
            </div>
          </div>
        )}
    </>
  );
};

export default Form;

function getCurrentApproval(form: FormType) {
  return form.formState.at(-2)?.to?.email;
}
