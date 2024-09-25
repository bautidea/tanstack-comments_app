import { useComments } from './hooks/useComments';
import { Comments } from './types';
import { JSX } from 'preact/compat';
import { Check, Clock } from './assets/icons';

export function App() {
  const { data, isError, isLoading, commentMutation } = useComments();
  function handleSubmit(
    event: JSX.TargetedEvent<HTMLFormElement, SubmitEvent>
  ) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const commentTitle = formData.get('commentTitle')?.toString() ?? '';
    const commentContent = formData.get('commentContent')?.toString() ?? '';
    // Since the API doesnt autogenerate the id im going to generate it
    // based on the max id that is present on data when fetched.
    // This is not the correct way to work.
    if (!data || !commentTitle || !commentContent) return;

    const newComment = {
      title: commentTitle,
      comment: commentContent,
    };

    // Tanstack API call.
    commentMutation.mutate(newComment);

    // Reset form fields.
    event.currentTarget.reset();
  }
  console.log(data);

  return (
    <div className={'w-full h-full flex'}>
      <div
        className={'w-1/2 flex flex-col px-5 py-10 gap-5'}
        style={{
          background: '#A3B7C1',
          overflowX: 'hidden',
          overflowY: 'auto',
        }}
      >
        {isLoading && <strong>Loading...</strong>}

        {isError && <strong>Error</strong>}

        {!isLoading &&
          !isError &&
          data?.map((comment: Comments) => (
            <div
              className={
                'bg-white min-h-38 border-4 rounded-2xl p-5 border-slate-400 break-words hover:opacity-75'
              }
              key={comment.id}
            >
              <h1 className={'mb-4 text-2xl font-semibold'}>{comment.title}</h1>
              <div className={'w-full flex justify-between'}>
                <p className={'ml-6 text-lg w-5/6'}>{comment.comment}</p>
                <div className={'flex-none self-end'}>
                  {comment.sending ? Clock() : Check()}
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className={'w-1/2'} style={{ background: '#507687' }}>
        <form
          className={'flex flex flex-col px-12 gap-5 mt-10'}
          onSubmit={handleSubmit}
        >
          <label htmlFor="title" className={'text-xl'}>
            Add Comment:
          </label>
          <input
            id="title"
            name="commentTitle"
            className={'px-8 py-4 border-slate-400 border-2'}
            placeholder="Comment title..."
          />
          <textarea
            className={'px-8 py-4 border-slate-400 border-2 resize-none'}
            name="commentContent"
            placeholder="I want to comment out that..."
          />
          <button className="self-center" type="submit">
            'Send comment'
          </button>
        </form>
      </div>
    </div>
  );
}
