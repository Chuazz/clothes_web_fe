const formatVNDCurrency = (price: string | number): string => {
    let formattedPrice = price?.toString()?.replace(/[^\d]/g, '') || '0';

    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });

    return formatter.format(parseInt(formattedPrice)).toString();
};

const convertNoVN = (text: string): string => {
    const unicode = [
        'aàảãáạăằẳẵắặâầẩẫấậäæ',
        'AÀẢÃÁẠĂẰẲẴẮẶÂẦẨẪẤẬÄ',
        'Bß',
        'cç',
        'dđ',
        'DĐ',
        'eèẻẽéẹêềểễếệ',
        'EÈẺẼÉẸÊỀỂỄẾỆ',
        'iìỉĩíị',
        'IÌỈĨÍỊ',
        'oòỏõóọôồổỗốộơờởỡớợö',
        'OÒỎÕÓỌÔỒỔỖỐỘƠỜỞỠỚỢÖ',
        'uùủũúụưừửữứựü',
        'UÙỦŨÚỤƯỪỬỮỨỰÜ',
        'yỳỷỹýỵ',
        'YỲỶỸÝỴ',
        'nñ',
    ];

    for (let i = 0; i < unicode.length; i++) {
        let re = new RegExp('[' + unicode[i].substring(1) + ']', 'g');
        let char = unicode[i][0];

        text = text.replace(re, char);
    }

    return text;
};

const slug = (text: string): string => {
    return text
        .toString()
        .toLowerCase()
        .replace(/^-+/, '')
        .replace(/-+$/, '')
        .replace(/\s+/g, '-')
        .replace(/[^\u0100-\uFFFF\w\-]/g, '-')
        .replace(/\-\-+/g, '-');
};

export { convertNoVN, slug, formatVNDCurrency };
