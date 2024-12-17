import React, { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/store'
import { getNurseInfoRoute, selectNurseInfo } from '../../redux/slices/NurseInfoSlice'

function NurseDashboard() {
  const dispatch = useAppDispatch();
  const nurseInfo = useAppSelector(selectNurseInfo);

  useEffect( () => {
    if (!nurseInfo) {
      dispatch(getNurseInfoRoute());
    }
  }, [nurseInfo])
  
  return (
    <div>NurseDashboard</div>
  )
}

export default NurseDashboard