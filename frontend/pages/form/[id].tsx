import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import {
  Form as FormType,
  GetForm,
  JWTPayload,
  RoleEnum,
  User,
} from '../../components/api-types';
import DropDown from '../../components/DropDown';
import { getName, parseJwt } from '../../components/utils';

const Form: NextPage = () => {
  // get id from router
  const { query } = useRouter();

  const [nextUserRole, setUserRole] = useState<RoleEnum>();
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUser] = useState<User>();

  const [userData, setUserData] = useState<JWTPayload>();
  const [rejectedReason, setRejectedReason] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserData(parseJwt<JWTPayload>(token));
    }
  }, []);

  const formDataQuery = useQuery<GetForm>('form-' + query.id, async () => {
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

  const fetchUserQuery = useQuery<User[]>(
    'form-' + nextUserRole,
    async () => {
      if (nextUserRole) {
        const response = await fetch(
          process.env.NEXT_PUBLIC_API_URL + '/user/users?role=' + nextUserRole,
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
      return;
    },
    {
      onSuccess: (data) => {
        setUsers(data);
      },
    },
  );
  const form = formDataQuery?.data?.form;
  const formData = formDataQuery?.data?.formData;
  const { push } = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) push('/login');
  }, []);
  const canBeUpdated =
    form &&
    form?.rejected === false &&
    userData &&
    (userData.role === RoleEnum.SuperAdmin ||
      getCurrentApproval(form) === userData?.email ||
      (getCurrentApproval(form) === undefined &&
        form.formState[0].from.email === userData.email)) &&
    getCurrentRole(form) !== RoleEnum.VC;

  useEffect(() => {
    if (canBeUpdated && form) {
      const role = getCurrentRole(form);
      if (role) {
        const roleKeys = Object.keys(RoleEnum);
        // next role
        const nextRole = roleKeys.at(roleKeys.indexOf(role) + 1);
        if (nextRole) {
          setUserRole(nextRole as RoleEnum);
          fetchUserQuery.refetch();
        }
      } else {
        if (form.formState[0].from.email === userData.email) {
          const roleKeys = Object.keys(RoleEnum);

          const nextRole = roleKeys.at(roleKeys.indexOf(userData.role) + 1);
          console.log({ nextRole });
          if (nextRole) {
            setUserRole(nextRole as RoleEnum);
            fetchUserQuery.refetch();
          }
        }
      }
    }
  }, [canBeUpdated]);
  return (
    <>
      {formDataQuery.isSuccess && formDataQuery.data && form && (
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
                  {formDataQuery.data && (
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

              <h1 className="text-2xl font-bold mt-8 pb-4">MoD</h1>

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
                      {Object.keys(formData).map((e, idx) => {
                        if (e !== 'otherFields')
                          return (
                            <tr
                              key={`${e}-${idx}`}
                              className="bg-white border-b"
                            >
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
                          );
                      })}
                      {formData?.otherFields &&
                        Object.keys(formData.otherFields).map((e, idx) => {
                          return (
                            <tr
                              key={`${e}-${idx}`}
                              className="bg-white border-b"
                            >
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
                          );
                        })}
                    </tbody>
                  </table>
                </>
              )}

              <h1 className="text-2xl font-bold mt-8 pb-4">States</h1>
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50"></thead>

                {form?.formState &&
                  form.formState.map((e) => {
                    return (
                      <tr className="px-4">
                        <td className="py-4 px-6">
                          {`${e.from.firstName} ${e.from.lastName} (${e.from.email})`}
                        </td>
                      </tr>
                    );
                  })}
              </table>
            </div>
          </div>
        </>
      )}

      {canBeUpdated && users && users.length > 0 && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="py-6">
            <h1 className="text-2xl font-bold mt-10">Approve</h1>

            <DropDown
              data={users.map((e) => {
                return {
                  value: `${e.firstName} ${e.lastName} (${e.email})`,
                  key: e.email,
                };
              })}
              active={
                activeUser
                  ? {
                      value: `${activeUser.firstName} ${activeUser.lastName} (${activeUser.email})`,
                      key: activeUser.email,
                    }
                  : undefined
              }
              setActive={(key: string) => {
                setActiveUser(users.find((e) => e.email === key));
              }}
            />
            <button
              onClick={async () => {
                if (activeUser) {
                  await fetch(
                    process.env.NEXT_PUBLIC_API_URL + '/form/' + query.id,
                    {
                      body: JSON.stringify({ toUser: activeUser._id }),
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization:
                          'Bearer ' + localStorage.getItem('token'),
                      },
                    },
                  );

                  formDataQuery.refetch().then(() => {
                    fetchUserQuery.refetch();
                  });
                }
              }}
              className="group my-2 relative flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white hover:bg-green-700 focus:outline-none"
            >
              Submit
            </button>
            {userData.role !== RoleEnum.AdminOfficer && (
              <>
                {' '}
                <h1 className="text-2xl font-bold mt-8 pb-4">Reject</h1>
                <textarea
                  onChange={(e) => {
                    setRejectedReason(e.target.value);
                  }}
                  id="message"
                  rows={4}
                  required={true}
                  className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 t-dark:bg-gray-700 t-dark:border-gray-600 t-dark:placeholder-gray-400 t-dark:text-white t-dark:focus:ring-blue-500 t-dark:focus:border-blue-500"
                  placeholder="Write your thoughts here..."
                ></textarea>
                <button
                  onClick={async () => {
                    await fetch(
                      process.env.NEXT_PUBLIC_API_URL +
                        '/form/reject/' +
                        query.id,
                      {
                        body: JSON.stringify({
                          rejectedReason,
                        }),
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          Authorization:
                            'Bearer ' + localStorage.getItem('token'),
                        },
                      },
                    );
                  }}
                  className="group  relative flex justify-center rounded-md border border-transparent bg-red-600 py-2 px-4 text-sm font-medium text-white hover:bg-red-700 focus:outline-none"
                >
                  Reject MoD
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Form;

function getCurrentRole(form: FormType) {
  return form.formState.at(-2)?.to?.role as RoleEnum | undefined;
}

function getCurrentApproval(form: FormType) {
  return form.formState.at(-2)?.to?.email;
}
