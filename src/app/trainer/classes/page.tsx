'use client';

import { useState } from 'react';
import { useCurrentUser } from '@/lib/auth-context';
import {
  useMyClasses,
  useCreateClass,
  useUpdateClass,
  useDeleteClass,
  useClassReservations,
} from '@/hooks/useTrainerClasses';
import { ClassForm } from '@/components/ClassForm';
import { getErrorMessage } from '@/lib/api';
import { formatDateTime } from '@/lib/date';
import { Button } from '@/components/Button';
import { CenteredMessage } from '@/components/CenteredMessage';
import { Skeleton } from '@/components/Skeleton';
import {
  FitnessClass,
  RESERVATION_STATUS_LABEL,
  RESERVATION_STATUS_COLOR,
} from '@/types/api';

export default function TrainerClassesPage() {
  const { isLoggedIn, role, isInitialized } = useCurrentUser();
  const { data: classes, isLoading } = useMyClasses();

  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();

  const [isCreating, setIsCreating] = useState(false);
  const [editingClass, setEditingClass] = useState<FitnessClass | null>(null);
  const [expandedClassId, setExpandedClassId] = useState<number | null>(null);

  if (!isInitialized) {
    return <CenteredMessage message="불러오는 중..." />;
  }

  if (!isLoggedIn || role !== 'TRAINER') {
    return <CenteredMessage message="트레이너 계정만 접근할 수 있습니다." />;
  }

  const error = createClass.error || deleteClass.error;

  return (
    <main className="flex-1 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-foreground">
            내 클래스 관리
          </h1>
          {!isCreating && (
            <Button onClick={() => setIsCreating(true)}>+ 새 클래스</Button>
          )}
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400">
            {getErrorMessage(error, '요청에 실패했습니다.')}
          </p>
        )}

        {isCreating && (
          <ClassForm
            onSubmit={(values) =>
              createClass.mutate(values, {
                onSuccess: () => setIsCreating(false),
              })
            }
            onCancel={() => setIsCreating(false)}
            isSubmitting={createClass.isPending}
          />
        )}

        {isLoading && (
          <div className="mt-6 flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-2xl bg-surface p-4 shadow-sm shadow-black/10"
              >
                <div className="flex-1">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="mt-2 h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 flex flex-col gap-3">
          {classes?.map((fitnessClass) =>
            editingClass?.id === fitnessClass.id ? (
              <EditingClassRow
                key={fitnessClass.id}
                fitnessClass={fitnessClass}
                onDone={() => setEditingClass(null)}
              />
            ) : (
              <div
                key={fitnessClass.id}
                className="rounded-2xl bg-surface p-4 shadow-sm shadow-black/10"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-foreground">{fitnessClass.title}</p>
                    <p className="text-sm text-muted">
                      {formatDateTime(fitnessClass.classDateTime)} ·{' '}
                      {fitnessClass.currentCount}/{fitnessClass.capacity}명
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() =>
                        setExpandedClassId(
                          expandedClassId === fitnessClass.id
                            ? null
                            : fitnessClass.id,
                        )
                      }
                    >
                      {expandedClassId === fitnessClass.id
                        ? '예약자 닫기'
                        : '예약자 보기'}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setEditingClass(fitnessClass)}
                    >
                      수정
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        if (confirm('정말 삭제하시겠어요?')) {
                          deleteClass.mutate(fitnessClass.id);
                        }
                      }}
                    >
                      삭제
                    </Button>
                  </div>
                </div>

                {expandedClassId === fitnessClass.id && (
                  <ReserveeList classId={fitnessClass.id} />
                )}
              </div>
            ),
          )}

          {classes?.length === 0 && !isLoading && (
            <p className="text-muted">등록된 클래스가 없습니다.</p>
          )}
        </div>
      </div>
    </main>
  );
}

function ReserveeList({ classId }: { classId: number }) {
  const { data: reservations, isLoading } = useClassReservations(classId);

  if (isLoading) {
    return <Skeleton className="mt-3 h-16 w-full" />;
  }

  if (!reservations || reservations.length === 0) {
    return (
      <p className="mt-3 border-t border-border pt-3 text-sm text-muted">
        아직 예약자가 없습니다.
      </p>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
      {reservations.map((reservation) => (
        <div
          key={reservation.id}
          className="flex items-center justify-between text-sm"
        >
          <span className="text-foreground">{reservation.memberName}</span>
          <span className={RESERVATION_STATUS_COLOR[reservation.status]}>
            {RESERVATION_STATUS_LABEL[reservation.status]}
          </span>
        </div>
      ))}
    </div>
  );
}

function EditingClassRow({
  fitnessClass,
  onDone,
}: {
  fitnessClass: FitnessClass;
  onDone: () => void;
}) {
  const updateClass = useUpdateClass(fitnessClass.id);

  return (
    <ClassForm
      initial={fitnessClass}
      onSubmit={(values) => updateClass.mutate(values, { onSuccess: onDone })}
      onCancel={onDone}
      isSubmitting={updateClass.isPending}
    />
  );
}
