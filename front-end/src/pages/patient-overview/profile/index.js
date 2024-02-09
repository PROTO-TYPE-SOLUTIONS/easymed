import AuthGuard from '@/assets/hoc/auth-guard';
import ProfileLayout from '@/components/layout/profile-layout';
import OverviewNav from '@/components/patient-profile/overview/OverviewNav';
import PersonalDetails from '@/components/patient-profile/personal-details';
import { Container, Grid } from '@mui/material';
import React from 'react'

const PatientProfile = () => {
  return (
    <AuthGuard>
      <Container className="">
        <OverviewNav/>
        <Grid container spacing={4}>
          <Grid item md={12} xs={12}>
            <section className="my-8 space-y-8 bg-white p-2 sm:p-4 rounded-lg">
              <section className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl text-primary">Personal Information</h1>
                </div>
                {/* <div>
                  <div
                    onClick={handleClick}
                    className="flex items-center cursor-pointer gap-2 bg-primary text-white rounded-xl p-2"
                  >
                    <p className="text-sm">Select Service</p>
                    <IoChevronDownOutline className="font-bold cursor-pointer" />
                  </div>
                  <div>
                    <Menu
                      id="basic-menu"
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "left",
                      }}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem>
                        <BookAppointmentModal />
                      </MenuItem>
                      <MenuItem>
                        <LabServiceModal />
                      </MenuItem>
                    </Menu>
                  </div>
                </div> */}
              </section>
              <PersonalDetails />
            </section>
          </Grid>
        </Grid>
      </Container>
    </AuthGuard>

  )
}

PatientProfile.getLayout = (page) => <ProfileLayout>{page}</ProfileLayout>;

export default PatientProfile