import * as Yup from 'yup';

export type DeliveryOption = 'DELIVERY' | 'CURBSIDE' | 'IN_STORE' | string;

export interface DeliveryPreferenceFormValues {
  deliveryOption: DeliveryOption;
  address?: string;
  deliveryDate?: string;
  deliveryTime?: string;
}

export const validationSchema: Yup.ObjectSchema<DeliveryPreferenceFormValues> = Yup.object().shape({
  deliveryOption: Yup.string().required('Please select a delivery option'),

  address: Yup.string().when('deliveryOption', {
    is: (val: DeliveryOption) => val === 'DELIVERY' || val === 'CURBSIDE',
    then: (schema: Yup.StringSchema) => schema.required('Address is required'),
    otherwise: (schema: Yup.StringSchema) => schema.notRequired(),
  }),

  deliveryDate: Yup.string().when('deliveryOption', {
    is: (val: DeliveryOption) => val === 'DELIVERY' || val === 'CURBSIDE',
    then: (schema: Yup.StringSchema) => schema.required('Delivery date is required'),
    otherwise: (schema: Yup.StringSchema) => schema.notRequired(),
  }),

  deliveryTime: Yup.string().when('deliveryOption', {
    is: (val: DeliveryOption) => ['DELIVERY', 'CURBSIDE', 'IN_STORE'].includes(val),
    then: (schema: Yup.StringSchema) => schema.required('Time is required'),
    otherwise: (schema: Yup.StringSchema) => schema.notRequired(),
  }),
});
