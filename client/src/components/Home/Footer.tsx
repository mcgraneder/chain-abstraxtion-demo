
import Logo from "../../../public/svgs/assets/cake.svg";
import { UilFacebook, UilTwitter, UilLinkedin } from "@iconscout/react-unicons"
const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph: "font-poppins text-[18px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-8 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};

export const footerLinks = [
  {
    title: "Useful Links",
    links: [
      {
        name: "Content",
        link: "https://www.hoobank.com/content/",
      },
      {
        name: "How it Works",
        link: "https://www.hoobank.com/how-it-works/",
      },
      {
        name: "Create",
        link: "https://www.hoobank.com/create/",
      },
      {
        name: "Explore",
        link: "https://www.hoobank.com/explore/",
      },
      {
        name: "Terms & Services",
        link: "https://www.hoobank.com/terms-and-services/",
      },
    ],
  },
  {
    title: "Community",
    links: [
      {
        name: "Help Center",
        link: "https://www.hoobank.com/help-center/",
      },
      {
        name: "Partners",
        link: "https://www.hoobank.com/partners/",
      },
      {
        name: "Suggestions",
        link: "https://www.hoobank.com/suggestions/",
      },
      {
        name: "Blog",
        link: "https://www.hoobank.com/blog/",
      },
      {
        name: "Newsletters",
        link: "https://www.hoobank.com/newsletters/",
      },
    ],
  },
  {
    title: "Partner",
    links: [
      {
        name: "Our Partner",
        link: "https://www.hoobank.com/our-partner/",
      },
      {
        name: "Become a Partner",
        link: "https://www.hoobank.com/become-a-partner/",
      },
    ],
  },
];

export const socialMedia = [
  {
    id: "social-media-2",
    icon: <UilFacebook />,
    link: "https://www.facebook.com/",
  },
  {
    id: "social-media-3",
    icon: <UilTwitter />,
    link: "https://www.twitter.com/",
  },
  {
    id: "social-media-4",
    icon: <UilLinkedin />,
    link: "https://www.linkedin.com/",
  },
];

const Footer = () => (
  <section
    className={`${styles.flexCenter} ${styles.paddingY} absolute left-0 w-full flex-col bg-[rgb(27,32,53)] px-20`}
  >
    <div className={`${styles.flexStart} mb-8 w-full flex-col md:flex-row`}>
      <div className=" flex flex-[1] flex-col justify-start">
        <Logo className="h-[72.14px] w-[266px] object-contain" />
        <p className={`${styles.paragraph} mt-4 max-w-[312px] text-[#7a6eaa]`}>
          A new way to make the payments easy, reliable and secure.
        </p>
      </div>

      <div className="mt-10 flex w-full flex-[1.5] flex-row flex-wrap justify-between md:mt-0">
        {footerLinks.map((footerlink) => (
          <div
            key={footerlink.title}
            className={`ss:my-0 my-4 flex min-w-[150px] flex-col`}
          >
            <h4 className="font-poppins text-[18px] font-medium leading-[27px] text-white">
              {footerlink.title}
            </h4>
            <ul className="mt-4 list-none">
              {footerlink.links.map((link, index) => (
                <li
                  key={link.name}
                  className={`cursor-pointer font-poppins text-[16px] font-normal leading-[24px] text-dimWhite hover:text-secondary ${
                    index !== footerlink.links.length - 1 ? "mb-4" : "mb-0"
                  }`}
                >
                  {link.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    <div className="flex w-full flex-col items-center justify-between border-t-[1px] border-t-[#3F3E45] px-10 pt-6 md:flex-row">
      <p className="text-center font-poppins text-[18px] font-normal leading-[27px] text-white">
        Copyright Ⓒ 2022 PancakeSwap. All Rights Reserved.
      </p>
    </div>
  </section>
);

export default Footer;