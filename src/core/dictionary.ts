export type BusinessCategory = 'beauty' | 'medical' | 'education' | 'generic';

export const getDictionary = (category: BusinessCategory | string = 'beauty') => {
  switch (category) {
    case 'medical':
      return {
        business: 'مطب/کلینیک',
        provider: 'پزشک',
        client: 'بیمار',
        service: 'ویزیت',
      };
    case 'education':
      return {
        business: 'آموزشگاه',
        provider: 'استاد',
        client: 'دانشجو',
        service: 'کلاس',
      };
    case 'generic':
      return {
        business: 'مجموعه',
        provider: 'پرسنل',
        client: 'مشتری',
        service: 'خدمت',
      };
    case 'beauty':
    default:
      return {
        business: 'سالن',
        provider: 'آرایشگر/پرسنل',
        client: 'مشتری',
        service: 'خدمت',
      };
  }
};
