'use client'

import Navbar from '../_components/Navbar'
import PaymentsTitle from '../_components/PaymentsTitle'
import {
  UserInfoSection,
  DeliveryRequestSection,
  PaymentsListSection,
} from '../_components/payments/components'
import PaymentsActionSection from '../_components/payments/PaymentsActionSection'
import { useState } from 'react'

export default function PaymentsPage() {
  const [userRequest, setUserRequest] = useState<string>('')

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <ContentWrapper>
        <PaymentsTitle step="payment" />
        <div className="flex gap-8 mt-6 min-h-[calc(100vh-469px)]">
          <div className="w-[60%] flex flex-col gap-12">
            <UserInfoSection />
            <DeliveryRequestSection userRequest={userRequest} setUserRequest={setUserRequest} />
            <PaymentsListSection />
          </div>
          <div className="w-[40%]">
            <PaymentsActionSection userRequest={userRequest} />
          </div>
        </div>
      </ContentWrapper>
    </div>
  )
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-5xl flex flex-col">{children}</div>
    </div>
  )
}
