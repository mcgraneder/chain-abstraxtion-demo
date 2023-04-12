export const stats = [
  {
    id: "stats-1",
    title: "User Active",
    value: "3800+",
  },
  {
    id: "stats-2",
    title: "Trusted by Company",
    value: "230+",
  },
  {
    id: "stats-3",
    title: "Transaction",
    value: "$230M+",
  },
];
const styles = {
  boxWidth: "xl:max-w-[1280px] w-full",

  heading2:
    "font-poppins font-semibold xs:text-[48px] text-[40px] text-white xs:leading-[76.8px] leading-[66.8px] w-full",
  paragraph: "font-poppins text-dimWhite text-[18px]",

  flexCenter: "flex justify-center items-center",
  flexStart: "flex justify-center items-start",

  paddingX: "sm:px-16 px-6",
  paddingY: "sm:py-16 py-6",
  padding: "sm:px-16 px-6 sm:py-12 py-4",

  marginX: "sm:mx-16 mx-6",
  marginY: "sm:my-16 my-6",
};
const Stats = () => (
  <div className={`${styles.flexCenter} mb-4 flex-row flex-wrap sm:mb-12 mt-10px mx-10`}>
    {stats.map((stat) => (
      <div
        key={stat.id}
        className={`m-3 flex flex-1 flex-row items-center justify-start`}
      >
        <h4 className="xs:leading-[53.16px ] text-[rgb(118,69,217)] font-poppins text-[25.89px] font-semibold  leading-[43.16px] xs:text-[35.89px]">
          {stat.value}
        </h4>
        <p className="text-gradient ml-3 font-poppins text-[13.45px] font-normal uppercase leading-[21.58px] text-[rgb(40,13,95)] xs:text-[18.45px] xs:leading-[26.58px]">
          {stat.title}
        </p>
      </div>
    ))}
  </div>
);

export default Stats;
