import { useEffect } from "react";
import { useRouter } from "next/router";
import { getSavedUser } from "@/utils/auth";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
	const router = useRouter();

	useEffect(() => {
		const user = getSavedUser();
		if (user) {
			if (user.role === "Admin") {
				router.replace(`/signup/success?orgId=${user.orgId}`);
			} else {
				router.replace("/app");
			}
		}
	}, []);
	const navLinks = [
		{
			href: "/",
			name: "Demo",
			subLinks: [
				{ href: "/", name: "Demo" },
				{ href: "/", name: "Demo" },
			],
		},
		{
			href: "/",
			name: "Hero",
		},
		{
			href: "/",
			name: "Problems",
		},
		{
			href: "/",
			name: "Features",
		},
		{
			href: "/",
			name: "Impacts",
		},
	];
	return (
		<div className="bg-[#F7F8FA] relative bg-[url('htts://res.cloudinary.com/dysj33nst/image/upload/v1760547570/Backgroundjj_phcyao.jpg')] bg-no-repeat">
			<div className="pt-7 fixed z-[999] w-full flex justify-center">
				<nav className="mx-64  bg-[#2E2E2E] rounded-[100px] p-3.5 flex items-center justify-between font-semibold text-[16px]">
					<div className="flex items-center space-x-[34px]">
						<div className="flex items-center space-x-1">
							<Image src={"/logo.svg"} width={40} height={40} />
							<h3 className="text-2xl  text-[#FFFFFF]">AidCare</h3>
						</div>
						<ul className="flex items-center space-x-[18px]">
							{navLinks.map(link => (
								<li
									key={link.href}
									className={`py-2.5 px-[18px] rounded-[100px] font-semibold text-[16px] bg-[#2E2E2E] text-[#CCCCCC]`}
								>
									<Link href={link.href}>{link.name}</Link>
								</li>
							))}
						</ul>
					</div>
					<div>
						<Link href={"/login"} className="cursor-pointer">
							<button className="bg-[#5865F2] cursor-pointer text-[#FFFFFF] py-2.5 px-[18px] rounded-[100px]">
								Login
							</button>
						</Link>
					</div>
				</nav>
			</div>
			<div className="flex flex-col z-[50] items-center justify-center pt-[150px]">
				<div className="flex items-center bg-[#FFFFFF] rounded-[100px] w-fit px-3.5 py-[9px]">
					<div className="flex -space-x-2 overflow-hidden">
						<div className="w-[36px] h-[36px] rounded-[100px] relative">
							<Image
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760546989/pro-user2_u4tgx8.svg"
								}
								className="rounded-[100px] object-cover"
								fill
							/>
						</div>
						<div className="w-[36px] h-[36px] rounded-[100px] relative">
							<Image
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760546991/pro-user3_y8vcxg.svg"
								}
								className="rounded-[100px] object-cover"
								fill
							/>
						</div>
						<div className="w-[36px] h-[36px] rounded-[100px] relative">
							<Image
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760546993/pro-user1_xddslm.svg"
								}
								className="rounded-[100px] object-cover"
								fill
							/>
						</div>
					</div>
					<p className="text-[#333333] font-medium text-base">123 Pro Users</p>
				</div>
				<div className="flex flex-col items-center justify-center">
					<h2 className="font-semibold text-[64px] text-center">
						AI-Powered Healthcare Support for Communities & Clinicians
					</h2>
					<p className="font-medium text-lg w-[900px] text-center mt-5">
						A dual-purpose system designed for frontline health workers and
						doctors to improve access, triage, and decision-making in Nigerian
						healthcare
					</p>
					<div className="pt-10 bg-[url('/net2-bg.svg')] bg-no-repeat w-full flex flex-col items-center justify-center">
						<Link href={"/signup"} className="cursor-pointer">
							<button className="bg-[#5865F2] cursor-pointer py-4 px-6 rounded-[100px]">
								<span className="font-semibold text-[17px] text-[#FFFFFF]">
									Sign Up
								</span>
							</button>
						</Link>
						<p className="text-base font-medium py-4">
							watch the live demo of AidCare below
						</p>
					</div>
				</div>
			</div>
			<div className="flex justify-center pt-[50px]">
				{/* Video container - Change this to AidCare demo when ready */}
				<div className="relative w-[1101px] h-[575px] rounded-[20px]">
					<Image
						src={
							"https://res.cloudinary.com/dysj33nst/image/upload/v1760547003/Video-Container_txgpom.svg"
						}
						fill
						className="object-cover"
					/>
				</div>
			</div>
			<div className="bg-[url('/net-bg.svg')] bg-no-repeat flex flex-col items-center justify-center">
				<h5 className="text-[#6E51E0] font-medium text-sm text-center">
					The problems
				</h5>
				<h3 className="font-semibold text-[58px] w-[776px] text-center">
					Bridging the Gap in Nigerian Healthcare
				</h3>
				<div className="flex flex-col items-center justify-center space-y-8">
					<div className="flex items-stretch space-x-8">
						<div className="bg-[#FFFFFF] flex justify-center flex-col items-start rounded-[12px] w-[700px] h-[360px]">
							<div className="border border-[#E9EBF1] rounded-[12px] py-[49px] my-1 mx-1 relative px-10">
								<div className="flex items-center space-x-4">
									<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
										<Image
											src={"/rocket.svg"}
											width={32}
											height={32}
											alt="Overwhelmed clinicians with high patient loads"
										/>
									</div>
									<h3 className="font-medium text-[21px] text-[#060B13]">
										Overwhelmed clinicians with high patient loads.
									</h3>
								</div>
								<p className="font-normal text-base text-[#363D4F] leading-8 mb-8 mt-5">
									In cities, doctors face the opposite challenge—endless queues
									of patients, limited consultation time, and mounting stress.
									This overload reduces the quality of care and leaves many
									patients without the attention they deserve.
								</p>
								<Link
									href={"/"}
									className="border border-[#ECEFF3] rounded-full px-3.5 py-1.5 text-[#060B13] font-medium text-sm"
								>
									View Solution
								</Link>
								<div className="absolute right-0 bottom-0">
									<Image
										src={"/11K3TzdAGn11B1G8T8W6sqg1gL70.svg"}
										width={300}
										height={300}
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="h-[360px] w-[280px] relative rounded-[12px]">
							<Image
								alt="Overwhelmed clinicians with high patient loads."
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760547008/kjerefrereq_pbpzgo.svg"
								}
								className="object-cover rounded-[12px]"
								fill
							/>
						</div>
					</div>
					<div className="flex items-stretch space-x-8">
						<div className="h-[380px] w-[280px] relative rounded-[12px]">
							<Image
								alt="Community Health Workers Lacking Diagnostic Support"
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760547008/qejasvuwqbhjb_lhyrgj.svg"
								}
								className="object-cover rounded-[12px]"
								fill
							/>
						</div>
						<div className="bg-[#FFFFFF] rounded-[12px] w-[700px] h-[380px]">
							<div className="border border-[#E9EBF1] flex justify-center flex-col items-start h-[370px] rounded-[12px] py-[49px] my-1 mx-1 relative px-10">
								<div className="flex items-center space-x-4">
									<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
										<Image
											src={"/rocket.svg"}
											width={32}
											height={32}
											alt="Community Health Workers Lacking Diagnostic Support"
										/>
									</div>
									<h3 className="font-medium text-[21px] text-[#060B13]">
										Community Health Workers Lacking Diagnostic Support.
									</h3>
								</div>
								<p className="font-normal text-base text-[#363D4F] leading-8 mb-8 mt-5">
									Community health workers are the first point of contact for
									millions, yet most have little to no diagnostic support.
									Without access to reliable tools or real-time guidance, they
									struggle to provide the level of care their communities need.
								</p>
								<Link
									href={"/"}
									className="border border-[#ECEFF3] rounded-full px-3.5 py-1.5 text-[#060B13] font-medium text-sm"
								>
									View Solution
								</Link>
								<div className="absolute right-0 bottom-0">
									<Image
										src={"/22DgHWoYZBUU3g92K7uGcb3P2NH8.svg"}
										className="-z-10"
										width={300}
										height={300}
										alt=""
									/>
								</div>
							</div>
						</div>
					</div>

					<div className="flex items-stretch space-x-8">
						<div className="bg-[#FFFFFF] rounded-[12px] w-[700px] h-[360px]">
							<div className="border border-[#E9EBF1] flex justify-center flex-col items-start h-full rounded-[12px] py-[49px] my-1 mx-1 relative px-10">
								<div className="flex items-center space-x-4">
									<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
										<Image
											src={"/rocket.svg"}
											width={32}
											height={32}
											alt="Customer Focus"
										/>
									</div>
									<h3 className="font-medium text-[21px] text-[#060B13]">
										Customer Focus.
									</h3>
								</div>
								<p className="font-normal text-base text-[#363D4F] leading-8 mb-8 mt-5">
									For many Nigerians living in remote communities, seeing a
									doctor is a rare privilege. Long travel distances, high costs,
									and understaffed facilities mean patients often wait until
									it’s too late to seek proper care.
								</p>
								<Link
									href={"/"}
									className="border border-[#ECEFF3] rounded-full px-3.5 py-1.5 text-[#060B13] font-medium text-sm"
								>
									View Solution
								</Link>
								<div className="absolute right-0 bottom-0">
									<Image
										src={"/11K3TzdAGn11B1G8T8W6sqg1gL70.svg"}
										width={300}
										height={300}
										alt=""
									/>
								</div>
							</div>
						</div>
						<div className="h-[360px] w-[280px] relative rounded-[12px]">
							<Image
								alt="Customer Focus."
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760547031/hgqvhrbj_y6dnho.svg"
								}
								className="object-cover rounded-[12px]"
								fill
							/>
						</div>
					</div>
				</div>
				<div className="bg-[url('/net2-bg.svg')] h-[220px] bg-no-repeat w-full flex flex-col items-center justify-center"></div>
			</div>
			<div className="flex items-center justify-center w-full">
				<div className="grid grid-cols-2 items-center justify-center w-full bg-white pt-[123px]">
					<div className="flex flex-col justify-start items-center w-full">
						<div className="">
							<h5 className="text-[#6E51E0] font-medium text-sm text-start">
								How AidCare Works
							</h5>
							<h2 className="font-medium text-[38px] leading-12 w-[520px]">
								Build a smarter healthcare support system for communities and
								clinicians.
							</h2>
						</div>
						<div className="grid grid-cols-2 gap-x-14 gap-y-8 mt-8">
							<div>
								<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
									<Image
										src={"/fire.svg"}
										width={32}
										height={32}
										alt="Overwhelmed clinicians with high patient loads"
									/>
								</div>
								<h4 className="font-medium text-base my-4">
									Triage Mode for CHWs
								</h4>
								<p className="w-[218px] font-normal text-sm text-[#363D4F]">
									Guide frontline health workers with AI-powered symptom checks,
									triage recommendations, and referral prompts.
								</p>
							</div>
							<div>
								<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
									<Image
										src={"/bolt.svg"}
										width={32}
										height={32}
										alt="Overwhelmed clinicians with high patient loads"
									/>
								</div>
								<h4 className="font-medium text-base my-4">
									Clinical Support for Doctors
								</h4>
								<p className="w-[218px] font-normal text-sm text-[#363D4F]">
									Enhance decision-making with AI-driven insights, patient
									history, and consultation summaries.
								</p>
							</div>
							<div>
								<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
									<Image
										src={"/chart.svg"}
										width={32}
										height={32}
										alt="Overwhelmed clinicians with high patient loads"
									/>
								</div>
								<h4 className="font-medium text-base my-4">
									Shared Consultation Workflow
								</h4>
								<p className="w-[218px] font-normal text-sm text-[#363D4F]">
									Connect CHWs and doctors seamlessly, ensuring patients receive
									the right care at the right time.
								</p>
							</div>
							<div>
								<div className=" rounded-full h-12 w-12 border border-[#E9EBF1]">
									<Image
										src={"/rocket.svg"}
										width={32}
										height={32}
										alt="Overwhelmed clinicians with high patient loads"
									/>
								</div>
								<h4 className="font-medium text-base my-4">
									Accessible Anytime, Anywhere
								</h4>
								<p className="w-[218px] font-normal text-sm text-[#363D4F]">
									Designed for low-connectivity settings with offline-first
									support, so no community is left behind.
								</p>
							</div>
						</div>
					</div>
					<div className="flex justify-center items-center">
						<div className="relative h-[560px] w-[525px]">
							<Image
								priority
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760548808/mobile-aidcare_r2pxtm.svg"
								}
								fill
								className="object-cover"
							/>
						</div>
					</div>
				</div>
			</div>
			<div className="flex items-center justify-center w-full pb-[91px] bg-white">
				<div className="grid grid-cols-2 items-center justify-center w-full  pt-[123px]">
					<div className="flex justify-center items-center">
						<div className="relative h-[560px] w-[500px]">
							<Image
								priority
								src={
									"https://res.cloudinary.com/dysj33nst/image/upload/v1760547045/bjabjbqna_ez609h.svg"
								}
								fill
								className="object-cover"
							/>
						</div>
					</div>
					<div className="flex flex-col justify-center items-center w-full">
						<div className="">
							<h5 className="text-[#6E51E0] font-medium text-sm text-start">
								Why It Matters
							</h5>
							<h2 className="font-medium text-[38px] leading-12 w-[520px]">
								Improving Healthcare Outcomes for Millions
							</h2>
							<p className="text-base font-normal text-[#363D4F] py-6 w-[520px]">
								AidCare is more than just an app— it’s built to make quality
								healthcare accessible, faster, and smarter for everyone.
							</p>
							<ul className="flex flex-col space-y-3.5 mt-2">
								<li className="flex items-center space-x-3">
									<div>
										<Image
											src={"/check.svg"}
											alt="check"
											width={24}
											height={24}
										/>
									</div>
									<p className="font-medium text-sm text-[#060B13]">
										50% faster triage decisions with AI-guided support.
									</p>
								</li>
								<li className="flex items-center space-x-3">
									<div>
										<Image
											src={"/check.svg"}
											alt="check"
											width={24}
											height={24}
										/>
									</div>
									<p className="font-medium text-sm text-[#060B13]">
										Designed to support doctors nationwide through real-time
										clinical insights.
									</p>
								</li>
								<li className="flex items-center space-x-3">
									<div>
										<Image
											src={"/check.svg"}
											alt="check"
											width={24}
											height={24}
										/>
									</div>
									<p className="font-medium text-sm text-[#060B13]">
										Built to scale across Nigerian communities with
										offline-first access.
									</p>
								</li>
							</ul>
							<div className="mt-14">
								<Link
									href={"/"}
									className="border border-[#ECEFF3] rounded-full px-3.5 py-3 text-[#060B13] font-medium text-sm flex w-fit space-x-2"
								>
									<span>Get Started</span>
									<div>
										<Image
											src={"enter-icon.svg"}
											width={24}
											height={24}
											alt="get started"
										/>
									</div>
								</Link>
							</div>
						</div>
					</div>
				</div>
			</div>
			<footer className="relative bg-[#266DF0] py-[80px] px-[136px]">
				<div className="flex flex-col space-y-8">
					<h3 className="font-bold text-[44px] text-[#A0C2FF] w-[668px]">
						Ready to support your patients with{" "}
						<span className="text-[#FFFFFF]">smarter AI tools</span>
					</h3>
					<div className="flex items-center space-x-3">
						<Link
							href={"/signup"}
							className="border-[0.5px] border-[#FFFFFF] font-medium text-base text-[#EDEEF0] py-3 px-4 rounded-xl"
						>
							Sign Up Today
						</Link>
						<Link
							href={"/login"}
							className="border-[0.5px] border-[#FFFFFF] font-medium text-base text-[#FFFFFF] py-3 px-4 rounded-xl"
						>
							Log in
						</Link>
					</div>
				</div>
				<div className="absolute bottom-0 right-0">
					<Image src={"/group-shapes.svg"} width={621} height={458} />
				</div>
			</footer>
		</div>
	);
}
