import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const patientApi = createApi({
    reducerPath: 'patientApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${process.env.REACT_APP_API_URL}/pharmaApi/patient`,
        credentials: "include"

    }),
    endpoints(builder) {
        return {
            getPatient: builder.query({
                providesTags: (result, error) => {
                    return ["Patient"];
                },

                query: () => ({
                    url: '/',
                    method: 'GET',
                }),
            }),

            getMedicines: builder.query({
                query: () => ({
                    url: '/medicines',
                    method: 'GET',
                }),
            }),

            getOrders: builder.query({
                query: () => ({
                    url: '/orders',
                    method: 'GET',
                }),
            }),

            payByWallet: builder.mutation({
                invalidatesTags: (result, error, arg) => {
                    return ["Patient"];
                },
                
                query: (data) => {
                    return {
                        url: "/payByWallet",
                        method: "PATCH",
                        body: data,
                    };
                },
            }),

            createOrder: builder.mutation({
                
                query: (data) => {
                    return {
                        url: "/createOrder",
                        method: "POST",
                        body: data,
                    };
                },
            }),

            cancelOrder: builder.mutation({
                
                query: (data) => {
                    return {
                        url: "/cancelOrder",
                        method: "PATCH",
                        body: data,
                    };
                },
            }),

            addToCart: builder.mutation({
                invalidatesTags: (result, error, arg) => {
                    return ["Patient"];
                },

                query: (data) => {
                    return {
                        url: "/addToCart",
                        method: "POST",
                        body: data,
                    };
                },
            }),

            removeFromCart: builder.mutation({
                invalidatesTags: (result, error, arg) => {
                    return ["Patient"];
                },

                query: (data) => {
                    return {
                        url: "/removeFromCart",
                        method: "DELETE",
                        body: data,
                    };
                },
            }),

            addDeliveryAddress: builder.mutation({
                
                query: (data) => {
                    return {
                        url: "/addDeliveryAddress",
                        method: "PATCH",
                        body: data,
                    };
                },
            }),

            changePassword: builder.mutation({
                query: (data) => {
                  return {
                    url: "/changePassword",
                    method: "PATCH",
                    body: data,
                  };
                },
            }),
            

        }
    },
});

export const {
    useGetPatientQuery,
    useGetMedicinesQuery,
    useGetOrdersQuery,
    usePayByWalletMutation,
    useCreateOrderMutation,
    useCancelOrderMutation,
    useAddToCartMutation,
    useRemoveFromCartMutation,
    useAddDeliveryAddressMutation,
    useChangePasswordMutation,
} = patientApi;
export { patientApi };