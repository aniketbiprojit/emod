import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import {
  Form as FormType,
  formDefaultData,
  formTestData,
  JWTPayload,
  RoleEnum,
} from '../components/api-types';

import { getName, parseJwt } from '../components/utils';

const CreateAnEMod: NextPage = () => {
  // get id from router

  const [, setUserData] = useState<JWTPayload>();

  const [data, setData] = useState<typeof formDefaultData>(formDefaultData);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUserData(parseJwt<JWTPayload>(token));
    }
  }, []);
  const mutation = useMutation('form-create', async () => {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + '/form/create',
      {
        method: 'POST',
        body: JSON.stringify({
          name: data.title,
          formData: data,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
      },
    );
    if (!response.ok) {
      alert('Fill all fields');
      throw new Error('Fill all fields');
    }

    const { _id } = await response.json();
    push('/form/' + _id);
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) push('/login');
  }, []);

  const { push } = useRouter();
  return (
    <>
      {
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="py-6">
              <h1 className="text-2xl font-bold mt-10">MoD</h1>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  mutation.mutate();
                }}
              >
                <>
                  <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                      <tr>
                        <th scope="col" className="py-3 px-6"></th>
                        <th scope="col" className="py-3 px-6"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.keys(formTestData).map((e, idx) => {
                        return (
                          <tr key={`${e}-${idx}`} className="bg-white border-b">
                            <th
                              style={{
                                width: '20px',
                              }}
                              scope="row"
                              className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap"
                            >
                              {getName(e)}
                            </th>
                            <td className="py-4 px-6">
                              {(formTestData as any)[e] === 'text' && (
                                <>
                                  <input
                                    type="text"
                                    onChange={(e) => {
                                      setData((data) => ({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                      }));
                                    }}
                                    name={e}
                                    required={true}
                                    className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 t-dark:bg-gray-700 t-dark:border-gray-600 t-dark:placeholder-gray-400 t-dark:text-white t-dark:focus:ring-blue-500 t-dark:focus:border-blue-500"
                                  />
                                </>
                              )}

                              {(formTestData as any)[e] === 'number' && (
                                <input
                                  onChange={(e) => {
                                    setData((data) => ({
                                      ...data,
                                      [e.target.name]: e.target.value,
                                    }));
                                  }}
                                  name={e}
                                  type="number"
                                  required={true}
                                  className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 t-dark:bg-gray-700 t-dark:border-gray-600 t-dark:placeholder-gray-400 t-dark:text-white t-dark:focus:ring-blue-500 t-dark:focus:border-blue-500"
                                />
                              )}

                              {(formTestData as any)[e] === 'textarea' && (
                                <>
                                  <textarea
                                    onChange={(e) => {
                                      setData((data) => ({
                                        ...data,
                                        [e.target.name]: e.target.value,
                                      }));
                                    }}
                                    name={e}
                                    id="message"
                                    rows={4}
                                    required={true}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 t-dark:bg-gray-700 t-dark:border-gray-600 t-dark:placeholder-gray-400 t-dark:text-white t-dark:focus:ring-blue-500 t-dark:focus:border-blue-500"
                                    placeholder="Description"
                                  ></textarea>
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
                {/* button */}
                <div className="flex justify-end mt-10">
                  <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default CreateAnEMod;
