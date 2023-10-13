import { BannerProps } from '@assets/types/UI';
import { Carousel } from 'primereact/carousel';
import { classNames } from 'primereact/utils';
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa6';
import Slider, { CustomArrowProps, Settings } from 'react-slick';

const Banner = ({
    numScroll = 1,
    numVisible = 1,
    showNavigators = true,
    showIndicators = true,
    delay = 800,
    prevBtnClassName,
    nextBtnClassName,
    actionOutside,
    children,
}: BannerProps) => {
    const NextIcon = (props: CustomArrowProps) => {
        return (
            <div
                className={classNames(
                    'text-xl w-4rem h-4rem border-circle top-50 z-4 absolute surface-300 flex align-items-center justify-content-center cursor-pointer hover:bg-primary hover:text-white transition-linear transition-all transition-duration-200 shadow-4',
                    nextBtnClassName,
                )}
                style={{ transform: 'translateY(-50%)', right: actionOutside ? '-4rem' : '0' }}
                onClick={props.onClick}
            >
                <FaChevronRight />
            </div>
        );
    };
    const PrevIcon = (props: CustomArrowProps) => {
        return (
            <div
                className={classNames(
                    'text-xl w-4rem h-4rem border-circle top-50 z-4 absolute surface-300 flex align-items-center justify-content-center cursor-pointer hover:bg-primary hover:text-white transition-linear transition-all transition-duration-200 shadow-4',
                    prevBtnClassName,
                )}
                style={{ transform: 'translateY(-50%)', left: actionOutside ? '-4rem' : '0' }}
                onClick={props.onClick}
            >
                <FaChevronLeft />
            </div>
        );
    };

    const settings: Settings = {
        dots: showIndicators,
        arrows: showNavigators,
        infinite: true,
        speed: delay,
        slidesToShow: numScroll,
        slidesToScroll: numVisible,
        nextArrow: <NextIcon />,
        prevArrow: <PrevIcon />,
        className: 'relative mb-4',
        dotsClass: 'gap-2 absolute flex align-items-center banner-dots left-50 mt-2',
        customPaging: (i) => {
            return (
                <a>
                    <div className='banner-pagination cursor-pointer'></div>
                </a>
            );
        },
    };
    return <Slider {...settings}>{children}</Slider>;
};

export default Banner;
