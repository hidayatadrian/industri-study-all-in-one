'use client';
import AgregateResultPure from '@/app/dashboard/agregatrequirement/result/agregatcontentresult';
import AgregateResultChase from '@/app/dashboard/agregatrequirement/result/agregatcontenchase';
import AgregatContentMixed from '@/app/dashboard/agregatrequirement/result/agregatcontentmixed';
export default function AgregatPoll2() {

   return (
      <div className="">
<AgregateResultPure />
<AgregateResultChase />
<AgregatContentMixed  />
      </div>
   )

}